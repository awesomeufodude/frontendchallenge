import { FC } from 'react'
import { CgSpinner } from 'react-icons/cg';

interface ReportsCardProps {
  up?: boolean;
  title: string;
  data: number | string
  subTitle: string
  percentage?: string | number
  show: boolean
  loading : boolean
}


const ReportsCard: FC<ReportsCardProps> = ({up, data, title, subTitle, percentage, show, loading}) => {
  return (
    <div className="rounded-lg border">
      <div className="max-w-md  px-6 pt-6 pb-5">
        <div className="inline-block">
          <h1 className="font-semibold text-lg">{title}</h1>
        </div>

        <div className="mt-6 flex gap-4 items-center">
          <div className="flex flex-col gap-2">
            <p className="text-4xl font-medium text-gray-800">
              {loading ? (
                <CgSpinner className="animate-spin" />
              ) : (
                data
              )}
            </p>
            <p className="text-sm font-medium text-gray-400">
              {subTitle}
            </p>
          </div>
          {show && (
            <>
              {up ? (
                <span className="rounded-full bg-emerald-100 text-sm font-medium text-emerald-600 flex flex-shrink-0 px-2 h-6 items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline h-4 w-4 pb-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                  {loading ? (
                    <CgSpinner className="animate-spin" />
                  ) : (
                    percentage
                  )}{' '}
                  %
                </span>
              ) : (
                <span className="rounded-full bg-rose-100 text-sm font-medium text-rose-600 flex flex-shrink-0 px-2 h-6 items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline h-4 w-4 pb-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                    />
                  </svg>
                  {loading ? (
                    <CgSpinner className="animate-spin" />
                  ) : (
                    percentage
                  )}{' '}
                  %
                </span>
              )}
            </>
          )}
        </div>
      </div>
      <hr className="border-gray-200" />
      <a
        href="/"
        className="block px-6 py-2 text-sm font-medium text-gray-600"
      >
        Download Report
      </a>
    </div>
  );
}

export default ReportsCard