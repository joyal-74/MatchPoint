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

            <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
            <div className="overflow-x-auto shadow-lg rounded-lg border border-border bg-card">
                <table className="min-w-full divide-y divide-border">
                    <thead>
                        <tr className="bg-primary">
                            {headers.map((header) => (
                                <th
                                    key={header}
                                    className="px-6 py-3 text-left text-xs font-medium text-primary-foreground uppercase tracking-wider whitespace-nowrap"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-card divide-y divide-border">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-muted/50 transition duration-150 ease-in-out"
                            >
                                {headers.map((header, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground"
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