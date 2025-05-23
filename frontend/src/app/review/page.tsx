// src/app/review/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ReviewPage() {
  // 模擬圖片數據
  const images = Array(24).fill("/api/placeholder/150/150");
  
  return (
    <div className="container mx-auto p-4">
      <div className="border border-dashed border-gray-300 rounded-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1"></div>
          <div className="w-32">
            <button className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
              提交審核
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-6 gap-2">
          {images.map((src, index) => (
            <div key={index} className="relative">
              <img 
                src={src} 
                alt={`Image ${index}`} 
                className={`w-full h-auto object-cover border ${index >= 18 ? 'border-yellow-400' : 'border-gray-200'}`}
              />
              {/* 為了模擬圖片中的不同顯示效果，將部分圖片做特殊處理 */}
              {index >= 12 && index < 18 && (
                <div className="absolute inset-0 bg-black opacity-50"></div>
              )}
              {/* 顯示勾選框，部分已選中 */}
              {index % 6 === 0 && (
                <div className="absolute bottom-2 left-2 w-4 h-4 bg-white border border-gray-300 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Link href="/" className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
          返回首頁
        </Link>
      </div>
    </div>
  );
}