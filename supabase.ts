import { createClient } from '@supabase/supabase-js';

// Prefer injected environment variables (e.g. via app.config.js or CI).
// Expo public env vars should be prefixed with EXPO_PUBLIC_ or REACT_NATIVE_ depending on setup.
const envUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const envKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const SUPABASE_URL = envUrl || 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = envKey || 'your-anon-key-here';

if (
	SUPABASE_URL.includes('your-project-ref') ||
	SUPABASE_ANON_KEY.includes('your-anon-key') ||
	SUPABASE_ANON_KEY === ''
) {
	// eslint-disable-next-line no-console
	console.warn(
		'supabase.ts: SUPABASE_URL or SUPABASE_ANON_KEY looks like a placeholder. Update supabase.ts or set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
	);
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
