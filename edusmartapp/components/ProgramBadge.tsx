
import React from 'react';
import { Program } from '../types';

interface ProgramBadgeProps {
  program: Program;
}

const ProgramBadge: React.FC<ProgramBadgeProps> = ({ program }) => {
  return (
    <span className={`text-xs font-semibold text-white px-2.5 py-1 rounded-full ${program.color}`}>
      {program.shortName}
    </span>
  );
};

export default ProgramBadge;
