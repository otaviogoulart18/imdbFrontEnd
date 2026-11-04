import React, { useState } from 'react';
import { ApiPayload, ApiResponse } from '../types/prediction';
import { Code2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface PayloadInspectorProps {
  payload: ApiPayload | null;
  response: ApiResponse | null;
}

export const PayloadInspector: React.FC<PayloadInspectorProps> = ({
  payload,
  response,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<'req' | 'res' | null>(null);

  if (!payload && !response) return null;

  const copyToClipboard = (text: string, key: 'req' | 'res') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const reqJson = payload ? JSON.stringify(payload, null, 2) : '';
  const resJson = response ? JSON.stringify(response, null, 2) : '';

  return (
    <div className="rounded-xl border border-[#27272a] bg-[#141416] p-4 text-xs font-mono">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-neutral-300 hover:text-white transition-colors"
      >
        <span className="flex items-center gap-2 font-semibold">
          <Code2 className="w-4 h-4 text-[#F5C518]" />
          Inspeção Técnica de Payload HTTP (JSON Request & Response)
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-neutral-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#27272a]">
          {/* Request Payload */}
          <div className="rounded-lg bg-[#0c0c0e] border border-[#27272a] p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#27272a]">
              <span className="text-[11px] text-[#F5C518] font-bold">
                POST Request Body (Strict Format)
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(reqJson, 'req')}
                className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                {copiedKey === 'req' ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedKey === 'req' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="text-neutral-300 overflow-x-auto text-[11px] leading-relaxed">
              {reqJson}
            </pre>
          </div>

          {/* Response Payload */}
          <div className="rounded-lg bg-[#0c0c0e] border border-[#27272a] p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#27272a]">
              <span className="text-[11px] text-emerald-400 font-bold">
                Response Retornada pela API
              </span>
              {response && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(resJson, 'res')}
                  className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === 'res' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedKey === 'res' ? 'Copiado' : 'Copiar'}</span>
                </button>
              )}
            </div>
            <pre className="text-neutral-300 overflow-x-auto text-[11px] leading-relaxed">
              {resJson || '// Aguardando resposta...'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
