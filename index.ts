import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';

type FilePath = string;
type DirectoryPath = string;

const askForConfirmation = (question: string): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
};

const getArgumentValue = (argName: string, defaultValue: string): string => {
  const arg = process.argv.find((arg) => arg.startsWith(`${argName}=`));
  return arg ? arg.split('=')[1] : defaultValue;
};

const directoryPath: DirectoryPath = getArgumentValue('path', '');
const oldOutputFolderName: string = getArgumentValue('oldOutput', 'old');
const outputFolderName: string = getArgumentValue('output', 'webp');
const quality: number = parseInt(getArgumentValue('quality', '85'), 10);

if (!directoryPath) {
  console.error('No path argument provided. Use path=<directory-path>.');
  process.exit(1);
}

if (!fs.existsSync(directoryPath)) {
  console.error(`The directory ${directoryPath} does not exist.`);
  process.exit(1);
}

const oldOutputDirectory: DirectoryPath = path.join(
  directoryPath,
  oldOutputFolderName
);
const outputDirectory: DirectoryPath = path.join(
  directoryPath,
  outputFolderName
);
fs.ensureDirSync(oldOutputDirectory);
fs.ensureDirSync(outputDirectory);

const convertImageToWebP = async (filePath: FilePath): Promise<void> => {
  const fileName: string = path.basename(filePath, path.extname(filePath));
  const webpPath: FilePath = path.join(outputDirectory, `${fileName}.webp`);

  try {
    await sharp(filePath).webp({ quality }).toFile(webpPath);
    console.log(`Converted ${filePath} to ${webpPath} with quality ${quality}`);
  } catch (error) {
    console.error(`Error converting ${filePath}: ${(error as Error).message}`);
  }
};

const processDirectory = async (dirPath: DirectoryPath): Promise<void> => {
  const files: string[] = await fs.readdir(dirPath);

  for (const file of files) {
    const filePath: FilePath = path.join(dirPath, file);
    const fileStat: fs.Stats = await fs.stat(filePath);

    if (
      fileStat.isFile() &&
      ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'].includes(
        path.extname(file).toLowerCase()
      )
    ) {
      await convertImageToWebP(filePath);

      const oldOutputFilePath: FilePath = path.join(oldOutputDirectory, file);
      await fs.move(filePath, oldOutputFilePath);
      console.log(`Moved ${filePath} to ${oldOutputFilePath}`);
    }
  }
};

const execute = async () => {
  const confirmation = await askForConfirmation(
    `Are you sure you want to process the directory ${directoryPath} with oldOutput folder '${oldOutputFolderName}', output folder '${outputFolderName}', and quality ${quality}? (yes/no): `
  );

  if (confirmation) {
    processDirectory(directoryPath)
      .then(() => console.log('Processing completed.'))
      .catch((err) => console.error(`Error: ${(err as Error).message}`));
  } else {
    console.log('Operation cancelled.');
  }
};

execute();
