'use client';

import React from 'react';

export const DebugBanner = () => {
    return (
        <div className="fixed bottom-0 left-0 bg-black/80 text-white text-xs p-1 z-[9999] flex gap-2 items-center">
            <span>Project: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dayhoctructuyenquavideo'}</span>
            <button
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                className="bg-red-500 px-2 py-0.5 rounded hover:bg-red-600 cursor-pointer"
            >
                Clear Cache
            </button>
        </div>
    );
};
