; Nadaku for Windows - per-user installer (no admin rights). build.py compiles it with:
;   iscc /DAppVersion=1.0.0 /DSourceDir=<dist\Nadaku> /DOutputDir=<dist> /DIconFile=<build\nadaku.ico> nadaku.iss
; Installs to %LOCALAPPDATA%\Programs\Nadaku, adds Nadaku to the Start menu (and optionally the desktop) and lists it
; in Settings > Apps. The window keeps its data (what you saved in it) in %LOCALAPPDATA%\Nadaku, which
; uninstalling leaves in place so a reinstall finds it again.

#ifndef AppVersion
  #define AppVersion "1.0.0"
#endif
#ifndef SourceDir
  #define SourceDir "dist\Nadaku"
#endif
#ifndef OutputDir
  #define OutputDir "dist"
#endif
#ifndef IconFile
  #define IconFile "build\nadaku.ico"
#endif

[Setup]
AppId={{E81247BA-698B-569E-A6DE-E1E1C366EEFB}
AppName=Nadaku
AppVersion={#AppVersion}
AppVerName=Nadaku {#AppVersion}
AppPublisher=Juwen Lie
AppPublisherURL=https://juw12.github.io/nadaku/
AppSupportURL=https://github.com/juw12/nadaku
DefaultDirName={autopf}\Nadaku
DisableDirPage=yes
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
OutputDir={#OutputDir}
OutputBaseFilename=Nadaku-Windows-Setup
SetupIconFile={#IconFile}
UninstallDisplayIcon={app}\Nadaku.exe
UninstallDisplayName=Nadaku
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
CloseApplications=no
SetupLogging=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
Source: "{#SourceDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{userprograms}\Nadaku"; Filename: "{app}\Nadaku.exe"; Comment: "Belajar Mandarin dengan audio penutur asli, latihan nada"
Name: "{userdesktop}\Nadaku"; Filename: "{app}\Nadaku.exe"; Comment: "Belajar Mandarin dengan audio penutur asli, latihan nada"; Tasks: desktopicon

[Run]
Filename: "{app}\Nadaku.exe"; Description: "{cm:LaunchProgram,Nadaku}"; Flags: nowait postinstall skipifsilent

[UninstallRun]
Filename: "{app}\Nadaku.exe"; Parameters: "--stop"; Flags: runhidden waituntilterminated; RunOnceId: "StopNadaku"

[Code]
function PrepareToInstall(var NeedsRestart: Boolean): String;
var
  ResultCode: Integer;
begin
  Result := '';
  { Updating: close an open Nadaku window first so its files can be replaced. }
  if FileExists(ExpandConstant('{app}\Nadaku.exe')) then
    Exec(ExpandConstant('{app}\Nadaku.exe'), '--stop', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
end;
