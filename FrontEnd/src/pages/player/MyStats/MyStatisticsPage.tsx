import React from 'react';
import type { StatsRow, StatsSectionData } from './StatsRowTypes';
import StatsTable from './StatsTable';
import PlayerLayout from '../../layout/PlayerLayout';


const baseData: StatsRow = {
    Format: 'N/A', Mot: 0, Inns: 0, NO: 0, Runs: 0, HS: 0, Ave: 0,
    BF: 0, SR: 0, '100s': 0, '50s': 0, '6s': 0, '4s': 0, Ct: 0, St: 0
};

const battingData: StatsRow[] = [
    { ...baseData, Format: 'ODI', Mot: 130, Inns: 124, NO: 45, Runs: '12,345', HS: 183, Ave: 57.36, BF: '13,234', SR: 'SR', '100s': 50, '50s': 72, '6s': 4, '4s': 6, Ct: 230, St: 0 },
    { ...baseData, Format: 'T20', Mot: 230, Inns: 209, NO: 78, Runs: '4,513', HS: '123*', Ave: 48.34, BF: '22,424', SR: 'SR', '100s': 1, '50s': 38, '6s': 4, '4s': 6, Ct: 230, St: 0 },
    { ...baseData, Format: 'Test', Mot: 120, Inns: 98, NO: 34, Runs: '9,278', HS: '264*', Ave: 46.81, BF: '13,234', SR: 'SR', '100s': 29, '50s': 89, '6s': 4, '4s': 6, Ct: 230, St: 0 },
];

const bowlingData: StatsRow[] = [
    { ...baseData, Format: 'ODI', Mot: 130, Inns: 124, NO: 45, Runs: '12,345', HS: 183, Ave: 57.36, BF: '13,234', SR: 'SR', '100s': 50, '50s': 72, '6s': 4, '4s': 6, Ct: 230, St: 0 },
    { ...baseData, Format: 'T20', Mot: 230, Inns: 209, NO: 78, Runs: '4,513', HS: '123*', Ave: 48.34, BF: '22,424', SR: 'SR', '100s': 1, '50s': 38, '6s': 4, '4s': 6, Ct: 230, St: 0 },
    { ...baseData, Format: 'Test', Mot: 120, Inns: 98, NO: 34, Runs: '9,278', HS: '264*', Ave: 46.81, BF: '13,234', SR: 'SR', '100s': 29, '50s': 89, '6s': 4, '4s': 6, Ct: 230, St: 0 },
];

const tableHeaders: (keyof StatsRow)[] = [
    'Format', 'Mot', 'Inns', 'NO', 'Runs', 'HS', 'Ave', 'BF',
    'SR', '100s', '50s', '6s', '4s', 'Ct', 'St'
];

const statsSections: StatsSectionData[] = [
    {
        title: 'Batting & Fielding',
        headers: tableHeaders,
        data: battingData,
    },
    {
        title: 'Bowling',
        headers: tableHeaders,
        data: bowlingData,
    },
];


const MyStatisticsPage: React.FC = () => {
    return (
        <PlayerLayout>
            <div className="pt-10">

                <h1 className="text-2xl font-bold text-white mb-4">My Statistics</h1>

                <main className="container mx-auto">
                    {statsSections.map((section, index) => (
                        <StatsTable
                            key={index}
                            title={section.title}
                            headers={section.headers}
                            data={section.data}
                        />
                    ))}
                </main>

            </div>
        </PlayerLayout>
    );
};

export default MyStatisticsPage;