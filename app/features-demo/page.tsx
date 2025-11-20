import { CoachsCorner } from "@/components/learning/coachs-corner"
import { SeasonMode } from "@/components/gamification/season-mode"
import { Card } from "@/components/ui/card"

export default function FeaturesDemoPage() {
    return (
        <div className="container mx-auto py-12 px-4 space-y-12">
            <div>
                <h1 className="text-4xl font-heading mb-4">New Features Demo</h1>
                <p className="text-muted-foreground">Showcasing the new "Broadcast meets Chalkboard" learning tools.</p>
            </div>

            {/* Coach's Corner Demo */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">1. Coach's Corner Tooltips</h2>
                <Card className="p-8 bg-white dark:bg-gray-900">
                    <p className="text-xl leading-relaxed">
                        "The quarterback dropped back into the <CoachsCorner term="Pocket" definition="The protected area formed by offensive linemen around the QB. Staying inside gives him time to throw." videoUrl="https://www.youtube.com/embed/example">pocket</CoachsCorner> to scan the field.
                        Seeing the linebacker blitz, he decided to call an <CoachsCorner term="Audible" definition="A last-second play change made by the QB at the line of scrimmage based on the defense's setup.">audible</CoachsCorner> to adjust the protection."
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground">
                        *Hover over the underlined terms to see the Coach's Corner explanation.*
                    </p>
                </Card>
            </section>

            {/* Season Mode Demo */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold border-b pb-2">2. Season Mode Progress</h2>
                <div className="grid gap-8 md:grid-cols-2">
                    <Card className="p-6">
                        <h3 className="font-bold mb-4">Rookie (15%)</h3>
                        <SeasonMode progress={15} />
                    </Card>
                    <Card className="p-6">
                        <h3 className="font-bold mb-4">Starter (45%)</h3>
                        <SeasonMode progress={45} />
                    </Card>
                    <Card className="p-6">
                        <h3 className="font-bold mb-4">Pro Bowler (80%)</h3>
                        <SeasonMode progress={80} />
                    </Card>
                    <Card className="p-6">
                        <h3 className="font-bold mb-4">Super Bowl Champ (100%)</h3>
                        <SeasonMode progress={100} />
                    </Card>
                </div>
            </section>
        </div>
    )
}
