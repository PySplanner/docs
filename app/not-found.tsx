"use client";

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex flex-col w-full items-center justify-center min-h-full">
            <img src="./logo.svg" alt="PySplanner Logo" width={96} height={96} className="rounded-md mb-4" />
            <h1 className="text-2xl font-bold mb-2">404 - Page Not Found</h1>
            <p className="text-muted-foreground">The page you are looking for does not exist.</p>
            <Button className="mt-4 text-white" onClick={() => router.push('/')}>Go Home</Button>
        </div>
    );
}