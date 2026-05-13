[Setup]
AppName=Calculateur d'Électricité Unifié
AppVersion=1.01
AppPublisher=Antigravity
DefaultDirName={autopf}\Calculateur Electricite
DefaultGroupName=Calculateur Electricite
OutputDir=.
OutputBaseFilename=Setup_Opti-Elec_v1.01
Compression=lzma
SolidCompression=yes
SetupIconFile=favicon.ico

[Files]
Source: "index.html"; DestDir: "{app}"; Flags: ignoreversion
Source: "style.css"; DestDir: "{app}"; Flags: ignoreversion
Source: "app.js"; DestDir: "{app}"; Flags: ignoreversion
Source: "favicon.svg"; DestDir: "{app}"; Flags: ignoreversion
Source: "favicon.ico"; DestDir: "{app}"; Flags: ignoreversion
Source: "manifest.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "sw.js"; DestDir: "{app}"; Flags: ignoreversion
Source: "README.md"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\Calculateur d'Électricité"; Filename: "{app}\index.html"; IconFilename: "{app}\favicon.ico"
Name: "{autodesktop}\Calculateur d'Électricité"; Filename: "{app}\index.html"; Tasks: desktopicon; IconFilename: "{app}\favicon.ico"

[Tasks]
Name: "desktopicon"; Description: "Créer une icône sur le bureau"; GroupDescription: "Icônes supplémentaires :"

[Run]
Filename: "{app}\index.html"; Description: "Lancer Calculateur d'Électricité"; Flags: shellexec postinstall skipifsilent
