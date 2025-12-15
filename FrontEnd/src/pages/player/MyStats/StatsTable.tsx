import React from 'react';
import type { StatsRow } from './StatsRowTypes';

interface StatsTableProps {
    title: string;
    headers: (keyof StatsRow)[];
    data: StatsRow[];
}

const StatsTable: React.FC<StatsTableProps> = ({ title, headers, data }) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>

            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-neutral-700">

                    <thead>
                        <tr className="bg-green-600">
                            {headers.map((header) => (
                                <th
                                    key={header}
                                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-neutral-800 divide-y divide-neutral-700">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-neutral-700 transition duration-150 ease-in-out"
                            >
                                {headers.map((header, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300"
                                    >
                                        {row[header]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StatsTable;