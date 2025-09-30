const colors = [
  'bg-blue-700',
  'bg-green-700',
  'bg-red-700',
  'bg-purple-700',
  'bg-indigo-700',
  'bg-pink-600',
  'bg-yellow-600',
  'bg-teal-600',
  'bg-orange-500',
  'bg-cyan-500'
];

export default function ColorAccentBar({ id }: { id: string }) {
  const color = [...id].reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return <div className={`${colors[color]} h-2 w-full`} />;
}
