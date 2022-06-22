import path from 'path';

export const getCustomAlias = (alias: Record<string, string> = {}) => {
	return Object.entries(alias || []).reduce(
		(acc, [key, val]: [string, string]) => {
			acc[key] = path.resolve(process.cwd(), val);
			return acc;
		},
		{} as Record<string, string>
	);
};
