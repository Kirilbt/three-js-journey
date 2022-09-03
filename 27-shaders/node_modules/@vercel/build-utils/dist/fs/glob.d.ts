import vanillaGlob_ from 'glob';
import FileFsRef from '../file-fs-ref';
export declare type GlobOptions = vanillaGlob_.IOptions;
export default function glob(pattern: string, opts: GlobOptions | string, mountpoint?: string): Promise<Record<string, FileFsRef>>;
