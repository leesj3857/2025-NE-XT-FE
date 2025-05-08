import { useState } from 'react';
import { mdiCheckCircleOutline, mdiCloseCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { validatePasswordRules } from '../utils/validatePasswordRules';

interface PasswordRulesProps {
  password: string;
  email: string;
  className?: string;
}

const PasswordRules = ({ password, email, className = '' }: PasswordRulesProps) => {
  const [showRules, setShowRules] = useState(false);
  const result = validatePasswordRules(password, email);

  // Sequential evaluation logic
  const evaluations = {
    length: result.length,
    notOnlyNumbers: result.length && result.notOnlyNumbers,
    notCommon: result.length && result.notOnlyNumbers && result.notCommon,
    notSimilarToEmail:
      result.length &&
      result.notOnlyNumbers &&
      result.notCommon &&
      result.notSimilarToEmail,
  };

  const getIcon = (valid: boolean) => (
    <Icon
      path={valid ? mdiCheckCircleOutline : mdiCloseCircleOutline}
      size={0.85}
      color={valid ? '#10B981' : '#EF4444'}
    />
  );

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setShowRules((prev) => !prev)}
        className="text-sm max-md:text-xs text-[#A67B5B] hover:underline mt-1 mb-2 outline-none"
      >
        {showRules ? 'Hide Password Rules' : 'Show Password Rules'}
      </button>

      {showRules && (
        <ul className="text-xs text-gray-700 space-y-2 mb-2">
          <li className="flex items-center gap-2">
            {getIcon(evaluations.length)} Must be at least 8 characters long
          </li>
          <li className="flex items-center gap-2">
            {getIcon(evaluations.notOnlyNumbers)} Cannot be only numbers (e.g. 12345678)
          </li>
          <li className="flex items-center gap-2">
            {getIcon(evaluations.notCommon)} Cannot be a common password (e.g. password, qwerty)
          </li>
          <li className="flex items-center gap-2">
            {getIcon(evaluations.notSimilarToEmail)} Cannot be similar to your email
          </li>
        </ul>
      )}
    </div>
  );
};

export default PasswordRules;
