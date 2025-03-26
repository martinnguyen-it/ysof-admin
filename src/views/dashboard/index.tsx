import { useGetDailyBibleQuotes } from '@/apis/dailyBible/useDailyBible'
import { LiturgicalSeasonColors } from '@/constants/dailyBible'
import { Main } from '@/components/layout/main'

export default function Dashboard() {
  const { data: dataDailyBibleQuotes } = useGetDailyBibleQuotes()

  return (
    <Main>
      <div className='mb-20 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
      </div>
      {dataDailyBibleQuotes && (
        <div className='mx-auto max-w-screen-md text-center'>
          <svg
            className='mx-auto mb-3 h-10 w-10 text-gray-400 dark:text-gray-600'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 18 14'
            style={{
              color: LiturgicalSeasonColors[dataDailyBibleQuotes.season],
            }}
          >
            <path d='M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z' />
          </svg>
          <div>
            <p
              className='rounded p-2 text-4xl font-medium italic'
              style={{
                backgroundColor:
                  LiturgicalSeasonColors[dataDailyBibleQuotes.season],
                color: '#fff',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
              }}
            >
              "{dataDailyBibleQuotes.gospel_ref}"
            </p>
          </div>
          <div className='mt-6 flex items-center justify-center space-x-3'>
            <span
              className='h-4 w-1'
              style={{
                backgroundColor:
                  LiturgicalSeasonColors[dataDailyBibleQuotes.season],
              }}
            />
            <p
              className='rounded p-2 font-medium dark:text-white'
              style={{
                backgroundColor:
                  LiturgicalSeasonColors[dataDailyBibleQuotes.season],
                color: '#fff',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
              }}
            >
              {dataDailyBibleQuotes.epitomize_text}
            </p>
            <span
              className='h-4 w-1'
              style={{
                backgroundColor:
                  LiturgicalSeasonColors[dataDailyBibleQuotes.season],
              }}
            />
          </div>
        </div>
      )}
    </Main>
  )
}
