'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Sparkles, Image as ImageIcon, Download, RefreshCw } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import { motion } from 'framer-motion'

export default function ThumbnailGeneratorPage() {
    const { colors } = useTheme()
    const [prompt, setPrompt] = useState('')
    const [style, setStyle] = useState('realistic')
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)

    const handleGenerate = () => {
        setIsGenerating(true)
        // Simulate AI generation delay
        setTimeout(() => {
            setIsGenerating(false)
            // For demo purposes, we'll just use a placeholder image based on the style
            const placeholders = {
                realistic: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=1000&auto=format&fit=crop',
                illustration: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1000&auto=format&fit=crop',
                minimalist: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop',
                neon: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop'
            }
            setGeneratedImage(placeholders[style as keyof typeof placeholders] || placeholders.realistic)
        }, 2000)
    }

    return (
        <div className={cn("min-h-screen p-8", colors.bg)}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className={cn("text-3xl font-bold flex items-center gap-3", colors.text)}>
                        <Sparkles className="w-8 h-8 text-yellow-500" />
                        Nano Banana Thumbnail Generator
                    </h1>
                    <p className={cn("text-lg mt-2", colors.textMuted)}>
                        Create stunning thumbnails for your courses and podcasts using AI.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Controls */}
                    <Card className={cn("backdrop-blur-xl border", colors.card, colors.cardBorder)}>
                        <CardHeader>
                            <CardTitle className={cn(colors.text)}>Configuration</CardTitle>
                            <CardDescription className={cn(colors.textMuted)}>
                                Describe what you want to see in your thumbnail.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className={cn(colors.text)}>Prompt</Label>
                                <Input
                                    placeholder="e.g., A football player sprinting on a futuristic field..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className={cn(colors.input, colors.inputBorder, colors.inputText)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className={cn(colors.text)}>Style</Label>
                                <Select value={style} onValueChange={setStyle}>
                                    <SelectTrigger className={cn(colors.input, colors.inputBorder, colors.inputText)}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="realistic">Realistic Photo</SelectItem>
                                        <SelectItem value="illustration">3D Illustration</SelectItem>
                                        <SelectItem value="minimalist">Minimalist Vector</SelectItem>
                                        <SelectItem value="neon">Cyberpunk Neon</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt}
                                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-6"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Generating Magic...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Generate Thumbnail
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Preview */}
                    <Card className={cn("backdrop-blur-xl border flex flex-col", colors.card, colors.cardBorder)}>
                        <CardHeader>
                            <CardTitle className={cn(colors.text)}>Preview</CardTitle>
                            <CardDescription className={cn(colors.textMuted)}>
                                Your generated thumbnail will appear here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex items-center justify-center min-h-[300px] bg-black/20 rounded-xl m-6 border-2 border-dashed border-white/10 relative overflow-hidden">
                            {generatedImage ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative w-full h-full group"
                                >
                                    <img
                                        src={generatedImage}
                                        alt="Generated thumbnail"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <Button variant="outline" className="text-white border-white/20 hover:bg-white/20">
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Regenerate
                                        </Button>
                                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <p className={cn("text-sm", colors.textMuted)}>
                                        Enter a prompt and click generate to see the magic happen.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
