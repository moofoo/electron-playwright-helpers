"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseElectronApp = exports.findLatestBuild = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ASAR = __importStar(require("asar"));
/**
 * Parses the `out` directory to find the latest build of your Electron project.
 * Use `npm run package` (or similar) to build your app prior to testing.
 *
 * @returns {string} - path to the most recently modified build directory
 */
function findLatestBuild(outpath = 'out') {
    // root of your project
    const rootDir = path_1.default.resolve('./');
    // directory where the builds are stored
    const outDir = path_1.default.join(rootDir, outpath);
    // list of files in the out directory
    const builds = fs_1.default.readdirSync(outDir);
    const platforms = [
        'win32',
        'win',
        'windows',
        'darwin',
        'mac',
        'macos',
        'osx',
        'linux',
        'ubuntu',
    ];
    const latestBuild = builds
        .map((fileName) => {
        // make sure it's a directory with "-" delimited platform in its name
        const stats = fs_1.default.statSync(path_1.default.join(outDir, fileName));
        const isBuild = fileName
            .toLocaleLowerCase()
            .split('-')
            .some((part) => platforms.includes(part));
        if (stats.isDirectory() && isBuild) {
            return {
                name: fileName,
                time: fs_1.default.statSync(path_1.default.join(outDir, fileName)).mtimeMs,
            };
        }
    })
        .sort((a, b) => {
        const aTime = a ? a.time : 0;
        const bTime = b ? b.time : 0;
        return bTime - aTime;
    })
        .map((file) => {
        if (file) {
            return file.name;
        }
    })[0];
    if (!latestBuild) {
        throw new Error('No build found in out directory');
    }
    return path_1.default.join(outDir, latestBuild);
}
exports.findLatestBuild = findLatestBuild;
/**
 * Given baseName, extract linux executable name.
 * Can't depend on .app, or .exe being in the name.
 * Assume baseName format is <appName>-<platform>-<arch>
 * @private
 */
function getLinuxExecutableName(baseName) {
    const tokens = baseName.split('-');
    const result = tokens.slice(0, tokens.length - 2).join('-');
    return result;
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
function parseElectronApp(buildDir) {
    console.log(`Parsing Electron app in ${buildDir}`);
    let platform = '';
    // in case the buildDir is the path to the app itself
    if (buildDir.endsWith('.app')) {
        buildDir = path_1.default.dirname(buildDir);
        platform = 'darwin';
    }
    if (buildDir.endsWith('.exe')) {
        buildDir = path_1.default.dirname(buildDir);
        platform = 'win32';
    }
    const baseName = path_1.default.basename(buildDir).toLowerCase();
    if (!platform) {
        // parse the directory name to figure out the platform
        if (baseName.includes('win')) {
            platform = 'win32';
        }
        if (baseName.includes('linux') ||
            baseName.includes('ubuntu') ||
            baseName.includes('debian')) {
            platform = 'linux';
        }
        if (baseName.includes('darwin') ||
            baseName.includes('mac') ||
            baseName.includes('osx')) {
            platform = 'darwin';
        }
    }
    if (!platform) {
        throw new Error(`Platform not found in directory name: ${baseName}`);
    }
    let arch;
    if (baseName.includes('x32') || baseName.includes('i386')) {
        arch = 'x32';
    }
    if (baseName.includes('x64')) {
        arch = 'x64';
    }
    if (baseName.includes('arm64')) {
        arch = 'arm64';
    }
    let executable;
    let main;
    let name;
    let asar;
    let resourcesDir;
    if (platform === 'darwin') {
        // MacOS Structure
        // <buildDir>/
        //   <appName>.app/
        //     Contents/
        //       MacOS/
        //        <appName> (executable)
        //       Info.plist
        //       PkgInfo
        //       Resources/
        //         electron.icns
        //         file.icns
        //         app.asar (asar bundle) - or -
        //         app
        //           package.json
        //           (your app structure)
        const list = fs_1.default.readdirSync(buildDir);
        const appBundle = list.find((fileName) => {
            return fileName.endsWith('.app');
        });
        if (!appBundle) {
            throw new Error(`Could not find app bundle in ${buildDir}`);
        }
        const appDir = path_1.default.join(buildDir, appBundle, 'Contents', 'MacOS');
        const appName = fs_1.default.readdirSync(appDir)[0];
        executable = path_1.default.join(appDir, appName);
        resourcesDir = path_1.default.join(buildDir, appBundle, 'Contents', 'Resources');
        const resourcesList = fs_1.default.readdirSync(resourcesDir);
        asar = resourcesList.includes('app.asar');
        let packageJson;
        if (asar) {
            const asarPath = path_1.default.join(resourcesDir, 'app.asar');
            packageJson = JSON.parse(ASAR.extractFile(asarPath, 'package.json').toString('utf8'));
            main = path_1.default.join(asarPath, packageJson.main);
        }
        else {
            packageJson = JSON.parse(fs_1.default.readFileSync(path_1.default.join(resourcesDir, 'app', 'package.json'), 'utf8'));
            main = path_1.default.join(resourcesDir, 'app', packageJson.main);
        }
        name = packageJson.name;
    }
    else if (platform === 'win32') {
        // Windows Structure
        // <buildDir>/
        //   <appName>.exe (executable)
        //   resources/
        //     app.asar (asar bundle) - or -
        //     app
        //       package.json
        //       (your app structure)
        const list = fs_1.default.readdirSync(buildDir);
        const exe = list.find((fileName) => {
            return fileName.endsWith('.exe');
        });
        if (!exe) {
            throw new Error(`Could not find executable in ${buildDir}`);
        }
        executable = path_1.default.join(buildDir, exe);
        resourcesDir = path_1.default.join(buildDir, 'resources');
        const resourcesList = fs_1.default.readdirSync(resourcesDir);
        asar = resourcesList.includes('app.asar');
        let packageJson;
        if (asar) {
            const asarPath = path_1.default.join(resourcesDir, 'app.asar');
            packageJson = JSON.parse(ASAR.extractFile(asarPath, 'package.json').toString('utf8'));
            main = path_1.default.join(asarPath, packageJson.main);
        }
        else {
            packageJson = JSON.parse(fs_1.default.readFileSync(path_1.default.join(resourcesDir, 'app', 'package.json'), 'utf8'));
            main = path_1.default.join(resourcesDir, 'app', packageJson.main);
        }
        name = packageJson.name;
    }
    else if (platform === 'linux') {
        // Linux Structure
        // <buildDir>/
        //   <appName> (executable)
        //   resources/
        //     app.asar (asar bundle) - or -
        //     app --- (untested - we're making assumptions here)
        //       package.json
        //       (your app structure)
        executable = path_1.default.join(buildDir, getLinuxExecutableName(baseName));
        resourcesDir = path_1.default.join(buildDir, 'resources');
        const resourcesList = fs_1.default.readdirSync(resourcesDir);
        asar = resourcesList.includes('app.asar');
        let packageJson;
        if (asar) {
            const asarPath = path_1.default.join(resourcesDir, 'app.asar');
            packageJson = JSON.parse(ASAR.extractFile(asarPath, 'package.json').toString('utf8'));
            main = path_1.default.join(asarPath, packageJson.main);
        }
        else {
            try {
                packageJson = JSON.parse(fs_1.default.readFileSync(path_1.default.join(resourcesDir, 'app', 'package.json'), 'utf8'));
                main = path_1.default.join(resourcesDir, 'app', packageJson.main);
            }
            catch (err) {
                throw new Error(`Could not find package.json in ${resourcesDir}. Apparently we don't quite know how Electron works on Linux yet. Please submit a bug report or pull request!`);
            }
        }
        name = packageJson.name;
    }
    else {
        throw new Error(`Platform not supported: ${platform}`);
    }
    return {
        executable,
        main,
        asar,
        name,
        platform,
        resourcesDir,
        arch,
    };
}
exports.parseElectronApp = parseElectronApp;
//# sourceMappingURL=find_parse_builds.js.map