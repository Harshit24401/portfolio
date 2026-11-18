import { type SkillGroup, SkillGroupSchema, type Track } from '@/lib/schemas';

// [name, tracks, where I used it]. tracks [] = core to both, never dimmed.
type Row = [string, Track[], string];
const group = (title: string, rows: Row[]) => ({
  title,
  skills: rows.map(([name, tracks, where]) => ({ name, tracks, where })),
});

export const skills: SkillGroup[] = SkillGroupSchema.array().parse([
  group('Languages', [
    ['Python', ['ml', 'fs'], 'EagleEye, CoE-DSAI'],
    ['TypeScript', ['fs', 'ml'], 'face-sort'],
    ['JavaScript', ['fs'], 'PeerCall'],
    ['SQL', ['fs', 'ml'], 'PeerCall'],
    ['C++', [], ''],
    ['C', [], ''],
    ['Bash', [], 'deploys'],
    ['R', ['ml'], ''],
  ]),
  group('Backend & web', [
    ['FastAPI', ['fs', 'ml'], 'CoE-DSAI, face-sort'],
    ['React', ['fs'], 'PeerCall, face-sort'],
    ['Node.js', ['fs'], 'PeerCall'],
    ['Express', ['fs'], 'PeerCall'],
    ['REST APIs', ['fs'], 'PeerCall'],
    ['WebSockets', ['fs'], 'PeerCall'],
    ['WebRTC', ['fs'], 'PeerCall'],
    ['PostgreSQL', ['fs'], 'Supabase'],
  ]),
  group('ML & AI', [
    ['LangGraph', ['ml'], 'EagleEye'],
    ['ONNX Runtime', ['ml'], 'face-sort'],
    ['PyTorch', ['ml'], ''],
    ['TensorFlow', ['ml'], ''],
    ['Keras', ['ml'], ''],
    ['Transformers', ['ml'], ''],
    ['scikit-learn', ['ml'], ''],
  ]),
  group('DevOps & tools', [
    ['Docker', [], 'CoE-DSAI, face-sort'],
    ['Docker Compose', [], 'CoE-DSAI'],
    ['Azure', [], 'CoE-DSAI'],
    ['Linux', [], 'CoE-DSAI'],
    ['Git', [], ''],
  ]),
]);
