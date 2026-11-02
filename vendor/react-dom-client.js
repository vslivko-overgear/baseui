import { C as M } from './react-all.js';
const X = M.default && typeof M.default === 'object' ? M.default : M;
export default X;
export const { createRoot, hydrateRoot, version } = X;
