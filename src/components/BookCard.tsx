import React from 'react';
import { Card } from './ui/card';
import { Check, Leaf } from 'lucide-react';

interface BookCardProps {
  title: string;
  selected: boolean;
  onToggle: () => void;
}

export function BookCard({ title, selected, onToggle }: BookCardProps) {
  return (
    <Card
      onClick={onToggle}
      className={`
        relative p-6 cursor-pointer transition-all duration-300 
        hover:scale-105 hover:shadow-lg overflow-hidden
        ${selected 
          ? 'bg-gradient-to-br from-[#A8CBB7] to-[#9fb8a8] text-white shadow-xl' 
          : 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-[#F7E6C3]/20'
        }
      `}
    >
      {/* Decorative leaf background */}
      <div className={`absolute -bottom-2 -right-2 ${selected ? 'opacity-20' : 'opacity-10'}`}>
        <Leaf className="w-24 h-24 text-[#A8CBB7] transform rotate-45" />
      </div>
      
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center z-10">
          <Check className="w-4 h-4 text-[#A8CBB7]" />
        </div>
      )}
      <div className="text-center relative z-10">
        <h3 className={selected ? 'text-white' : 'text-[#2d3436]'}>
          {title}
        </h3>
      </div>
    </Card>
  );
}
