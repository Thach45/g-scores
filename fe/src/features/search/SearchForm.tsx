import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Loader2 } from 'lucide-react';

const searchSchema = z.object({
  sbd: z
    .string()
    .length(8, 'Số báo danh phải có đúng 8 chữ số')
    .regex(/^\d+$/, 'Số báo danh chỉ được chứa chữ số'),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface SearchFormProps {
  onSearch: (sbd: string) => void;
  isLoading: boolean;
  errorMsg: string | null;
}

export default function SearchForm({ onSearch, isLoading, errorMsg }: SearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: SearchFormValues) => {
    onSearch(data.sbd);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <input
            type="text"
            {...register('sbd')}
            className={`block w-full pl-12 pr-32 py-4 text-lg border-2 rounded-2xl focus:ring-0 focus:outline-none transition-colors ${
              errors.sbd
                ? 'border-red-300 focus:border-red-500 bg-red-50'
                : 'border-gray-200 focus:border-blue-500 bg-white'
            }`}
            placeholder="Nhập 8 chữ số báo danh..."
            maxLength={8}
          />
          <div className="absolute inset-y-2 right-2 flex items-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Tra cứu'}
            </button>
          </div>
        </div>
        {errors.sbd && (
          <p className="mt-2 text-sm text-red-600 font-medium pl-4">{errors.sbd.message}</p>
        )}
      </form>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center text-red-600 font-medium">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
