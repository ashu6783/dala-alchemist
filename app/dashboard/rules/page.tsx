'use client'
import RuleBuilder from "@/components/RuleBuilder."

export default function RuleBuilderPage() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">
                Rule Engine
            </h1>
            <RuleBuilder />
        </div>
    )
}