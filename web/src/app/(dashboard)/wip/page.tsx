import { Wrench } from "lucide-react";
import React from "react";

const WorkInProgressPage = () => {
  return (
    <div className='flex flex-1 h-full flex-col gap-2 items-center justify-center align-middle'>
      <h2 className='text-2xl text-slate-400'>
        <Wrench className='aspect-square' size={48} />
      </h2>
      <span className='text-2xl font-bold text-slate-400'>
        Page is still work-in-progress!
      </span>
      <p className='text-slate-400 italic max-w-2xl text-justify mb-12'>
        We're actively building this page to bring you new features and
        improvements. Please check back soon or explore other sections of the
        dashboard in the meantime!
      </p>
    </div>
  );
};

export default WorkInProgressPage;
