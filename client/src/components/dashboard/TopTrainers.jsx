import React from 'react';
import { Star } from 'lucide-react';

const TopTrainers = ({ trainers = [] }) => {
  const displayTrainers = trainers.length > 0 ? trainers : [
    {
      _id: 1,
      name: 'Vikram Singh',
      specialization: ['Strength Trainer'],
      clients: 120,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=40&h=40&q=80'
    },
    {
      _id: 2,
      name: 'Neha Kapoor',
      specialization: ['Yoga Trainer'],
      clients: 98,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=40&h=40&q=80'
    },
    {
      _id: 3,
      name: 'Arjun Mehta',
      specialization: ['Cardio Trainer'],
      clients: 85,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&h=40&q=80'
    },
    {
      _id: 4,
      name: 'Pooja Sharma',
      specialization: ['Fitness Trainer'],
      clients: 75,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=40&h=40&q=80'
    }
  ];

  return (
    <div className="bg-[#131b2c] p-6 rounded-2xl border border-card-dark flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-slate-200">Top Trainers</h3>
        <a href="/trainers" className="text-xs text-slate-400 hover:text-brand-yellow transition-colors bg-bg-dark border border-card-dark px-3 py-1.5 rounded-lg">
          View All
        </a>
      </div>
      
      <div className="flex flex-col gap-4">
        {displayTrainers.map((trainer) => {
          const specText = Array.isArray(trainer.specialization) ? trainer.specialization.join(', ') : trainer.specialization || 'Fitness Instructor';
          const trainerAvatar = trainer.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&h=40&q=80';
          return (
            <div key={trainer._id || trainer.id} className="flex items-center justify-between group cursor-pointer hover:bg-card-dark p-2 -mx-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <img src={trainerAvatar} alt={trainer.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{trainer.name}</p>
                  <p className="text-xs text-slate-400">{specText}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden sm:block text-right">
                  <p className="text-sm text-slate-300">{trainer.clients}</p>
                  <p className="text-xs text-slate-400">Clients</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
                  <span className="text-sm font-semibold text-white">{trainer.rating}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopTrainers;
