/**
 * Parses the `out` directory to find the latest build of your Electron project.
 * Use `npm run package` (or similar) to build your app prior to testing.
 *
 * @returns {string} - path to the most recently modified build directory
 */
export declare function findLatestBuild(outpath?: string): string;
declare type Architecture = 'x64' | 'x32' | 'arm64' | undefined;
/**
 * Format of the data returned from `parseElectronApp()`
 * @typedef ElectronAppInfo
 * @prop {string} executable - path to the Electron executable
 * @prop {string} main - path to the main (JS) file
 * @prop {string} name - name of the your application
 * @prop {string} resourcesDir - path to the resources directory
 * @prop {boolean} asar - whether the app is packaged as an asar archive
 * @prop {string} platform - 'darwin', 'linux', or 'win32'
 * @prop {string} arch - 'x64', 'x32', or 'arm64'
 */
export interface ElectronAppInfo {
    /** Path to the app's executable file */
    executable: string;
    /** Path to the app's main (JS) file */
    main: string;
    /** Name of the app */
    name: string;
    /** Resources directory */
    resourcesDir: string;
    /** True if the app is using asar */
    asar: boolean;
    /** OS platform */
    platform: 'darwin' | 'win32' | 'linux';
    /** Architecture */
    arch: Architecture;
}
/**
 * Given a directory containing an Electron app build,
 * or the path to the app itself (directory on Mac, executable on Windows),
 * return a bunch of metadata, including the path to the app's executable
 * and the path to the app's main file.
 *
 * Format of the data returned is an object with the following properties:
 * - executable: path to the app's executable file
 * - main: path to the app's main (JS) file
 * - name: name of the app
 * - resourcesDir: path to the app's resources directory
 * - asar: true if the app is using asar
 * - platform: OS platform
 * - arch: architecture
 *
 * @param buildDir {string} - absolute path to the build directory or the app itself
 * @returns {ElectronAppInfo} metadata about the app
 */
export declare function parseElectronApp(buildDir: string): ElectronAppInfo;
export {};
//# sourceMappingURL=find_parse_builds.d.ts.map