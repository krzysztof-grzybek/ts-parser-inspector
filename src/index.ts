import * as ts from "typescript";

function createCompilerHost(fileName, fileContent): ts.CompilerHost {
  return {
    fileExists: () => true,
    getCanonicalFileName: (filename: string) => filename,
    getCurrentDirectory: () => '',
    getDefaultLibFileName: () => 'lib.d.ts',
    getDirectories: (_path: string) => [],
    getNewLine: () => '\n',
    getSourceFile: (filenameToGet: string) => {
      return filenameToGet === fileName ? ts.createSourceFile(filenameToGet, fileContent, ts.ScriptTarget.ES5, true) : undefined;
    },
    readFile: () => undefined,
    useCaseSensitiveFileNames: () => true,
    writeFile: () => undefined
  };
}

function compile(options: ts.CompilerOptions, fileContent): void {
  const fileNameMain = 'main.ts';

  const compilerHost: ts.CompilerHost = createCompilerHost(fileNameMain, fileContent);
  let program = ts.createProgram([fileNameMain], options, compilerHost);
  let emitResult = program.emit();

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
      );
    }
  });

  let exitCode = emitResult.emitSkipped ? 1 : 0;
  console.log(`Process exiting with code '${exitCode}'.`);
}

document.getElementById('input-code').addEventListener('input', (e) => {
  console.clear();
  compile({
    noEmitOnError: true,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
  }, (<HTMLTextAreaElement>e.target).value);
});
