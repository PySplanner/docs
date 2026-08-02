import { DocsMenuBar } from "@/components/docs-menu-bar";
import { ConstructionIcon } from "lucide-react";

export default function Docs() {
    return (
        <div className="flex flex-col w-full items-center min-h-full">
            <DocsMenuBar />
            <div className="flex flex-col items-center justify-center flex-1">
                <ConstructionIcon className="w-32 h-32 mb-4 text-primary" />
                <h1 className="text-2xl font-bold mb-2">Under Construction</h1>
                <p className="text-muted-foreground">Documentation will be available soon.</p>
            </div>
        </div>
    );
}