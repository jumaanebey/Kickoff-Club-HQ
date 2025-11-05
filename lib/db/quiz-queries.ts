// @ts-nocheck - Generated types may not match actual schema during build
import { supabase } from './supabase'

// ========== QUIZZES ==========

export async function getQuizzesByCourse(courseId: string) {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      quiz_questions (
        id,
        question_text,
        question_type,
        points,
        order_index
      )
    `)
    .eq('course_id', courseId)
    .eq('is_published', true)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getQuizById(quizId: string) {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      quiz_questions (
        *,
        quiz_question_options (*)
      )
    `)
    .eq('id', quizId)
    .eq('is_published', true)
    .single()

  if (error) throw error

  // Sort questions and options by order_index
  if (data?.quiz_questions) {
    data.quiz_questions.sort((a, b) => a.order_index - b.order_index)
    data.quiz_questions.forEach(q => {
      if (q.quiz_question_options) {
        q.quiz_question_options.sort((a, b) => a.order_index - b.order_index)
      }
    })
  }

  return data
}

// ========== QUIZ ATTEMPTS ==========

export async function createQuizAttempt(userId: string, quizId: string) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_id: quizId,
      score: 0,
      max_score: 0,
      is_passing: false,
      time_taken_seconds: 0
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserQuizAttempts(userId: string, quizId: string) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select(`
      *,
      quiz_user_answers (
        id,
        question_id,
        selected_option_id,
        text_answer,
        is_correct,
        points_earned
      )
    `)
    .eq('user_id', userId)
    .eq('quiz_id', quizId)
    .order('started_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getQuizAttemptById(attemptId: string) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select(`
      *,
      quizzes (
        id,
        title,
        passing_score_percentage,
        time_limit_minutes
      ),
      quiz_user_answers (
        *,
        quiz_questions (
          id,
          question_text,
          question_type,
          points
        ),
        quiz_question_options (
          id,
          option_text,
          is_correct
        )
      )
    `)
    .eq('id', attemptId)
    .single()

  if (error) throw error
  return data
}

// ========== QUIZ ANSWERS ==========

export async function saveQuizAnswer(
  attemptId: string,
  questionId: string,
  answer: {
    selectedOptionId?: string
    textAnswer?: string
  }
) {
  // Get question details
  const { data: question, error: questionError } = await supabase
    .from('quiz_questions')
    .select(`
      *,
      quiz_question_options (*)
    `)
    .eq('id', questionId)
    .single()

  if (questionError) throw questionError

  // Determine if answer is correct
  let isCorrect = false
  let pointsEarned = 0

  if (question.question_type === 'multiple_choice' && answer.selectedOptionId) {
    const selectedOption = question.quiz_question_options?.find(
      opt => opt.id === answer.selectedOptionId
    )
    isCorrect = selectedOption?.is_correct || false
  } else if (question.question_type === 'true_false' && answer.selectedOptionId) {
    const selectedOption = question.quiz_question_options?.find(
      opt => opt.id === answer.selectedOptionId
    )
    isCorrect = selectedOption?.is_correct || false
  }

  if (isCorrect) {
    pointsEarned = question.points || 0
  }

  // Save or update answer
  const { data, error } = await supabase
    .from('quiz_user_answers')
    .upsert({
      attempt_id: attemptId,
      question_id: questionId,
      selected_option_id: answer.selectedOptionId || null,
      text_answer: answer.textAnswer || null,
      is_correct: isCorrect,
      points_earned: pointsEarned
    }, {
      onConflict: 'attempt_id,question_id'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function submitQuizAttempt(attemptId: string) {
  // Get all answers for this attempt
  const { data: answers, error: answersError } = await supabase
    .from('quiz_user_answers')
    .select('points_earned')
    .eq('attempt_id', attemptId)

  if (answersError) throw answersError

  // Calculate total score
  const totalScore = answers?.reduce((sum, a) => sum + (a.points_earned || 0), 0) || 0

  // Get quiz to find max score and passing percentage
  const { data: attempt, error: attemptError } = await supabase
    .from('quiz_attempts')
    .select(`
      *,
      quizzes (
        id,
        passing_score_percentage,
        quiz_questions (points)
      )
    `)
    .eq('id', attemptId)
    .single()

  if (attemptError) throw attemptError

  const maxScore = attempt.quizzes?.quiz_questions?.reduce(
    (sum, q) => sum + (q.points || 0), 0
  ) || 0

  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0
  const isPassing = percentage >= (attempt.quizzes?.passing_score_percentage || 0)

  // Calculate time taken
  const startedAt = new Date(attempt.started_at)
  const now = new Date()
  const timeTakenSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000)

  // Update attempt with final results
  const { data, error } = await supabase
    .from('quiz_attempts')
    .update({
      score: totalScore,
      max_score: maxScore,
      is_passing: isPassing,
      completed_at: now.toISOString(),
      time_taken_seconds: timeTakenSeconds
    })
    .eq('id', attemptId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ========== ADMIN FUNCTIONS ==========

export async function createQuiz(courseId: string, quizData: {
  title: string
  description?: string
  passingScorePercentage: number
  timeLimitMinutes?: number
  allowRetakes: boolean
  showCorrectAnswers: boolean
  isPublished: boolean
  orderIndex: number
}) {
  const { data, error } = await supabase
    .from('quizzes')
    .insert({
      course_id: courseId,
      title: quizData.title,
      description: quizData.description,
      passing_score_percentage: quizData.passingScorePercentage,
      time_limit_minutes: quizData.timeLimitMinutes,
      allow_retakes: quizData.allowRetakes,
      show_correct_answers: quizData.showCorrectAnswers,
      is_published: quizData.isPublished,
      order_index: quizData.orderIndex
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createQuizQuestion(quizId: string, questionData: {
  questionText: string
  questionType: 'multiple_choice' | 'true_false' | 'short_answer'
  points: number
  orderIndex: number
  explanation?: string
}) {
  const { data, error } = await supabase
    .from('quiz_questions')
    .insert({
      quiz_id: quizId,
      question_text: questionData.questionText,
      question_type: questionData.questionType,
      points: questionData.points,
      order_index: questionData.orderIndex,
      explanation: questionData.explanation
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createQuizQuestionOption(questionId: string, optionData: {
  optionText: string
  isCorrect: boolean
  orderIndex: number
}) {
  const { data, error } = await supabase
    .from('quiz_question_options')
    .insert({
      question_id: questionId,
      option_text: optionData.optionText,
      is_correct: optionData.isCorrect,
      order_index: optionData.orderIndex
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteQuiz(quizId: string) {
  const { error } = await supabase
    .from('quizzes')
    .delete()
    .eq('id', quizId)

  if (error) throw error
}

export async function deleteQuizQuestion(questionId: string) {
  const { error } = await supabase
    .from('quiz_questions')
    .delete()
    .eq('id', questionId)

  if (error) throw error
}
