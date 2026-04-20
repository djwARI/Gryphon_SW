import React, { useState } from "react";
import {
  Beaker,
  Droplet,
  Layers,
  Settings,
  History,
  Search,
  Play,
  FlaskConical,
  TestTube2,
  Grid,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  Power,
  Box,
  Hexagon,
  Lock,
} from "lucide-react";

// Define the shape of a Protocol object
interface Protocol {
  id: number;
  title: string;
  category: string;
  description: string;
  plateType: string;
  icon: React.ReactNode;
}

// Define the shape of our volumes state
interface Volumes {
  reservoir: string;
  protein1: string;
  screen1: string;
  protein2: string;
  screen2: string;
  protein3: string;
  screen3: string;
}

// Define the shape of our advanced settings
interface AdvancedSettingsType {
  headLiquidClass: string;
  headWashVolume: string;
  headWashCycles: string;
  nanoLiquidClass: string;
  nanoWashTime: string;
  nanoDispenseSpeed: string;
}

const protocols: Protocol[] = [
  {
    id: 1,
    title: "Sitting Drop Screen",
    category: "Standard Screening",
    description: "High-throughput 96-well sitting drop vapor diffusion.",
    plateType: "INTELLI-PLATE 96-2",
    icon: <Grid className="w-8 h-8 text-blue-500" />,
  },
  {
    id: 2,
    title: "Hanging Drop Screen",
    category: "Standard Screening",
    description: "Classic 96-well hanging drop setup.",
    plateType: "Costar 96",
    icon: <Droplet className="w-8 h-8 text-teal-500" />,
  },
  {
    id: 3,
    title: "LCP Setup",
    category: "Membrane Proteins",
    description:
      "Lipidic Cubic Phase setup using specialized glass sandwich plates.",
    plateType: "Marienfeld Sandwich Plate",
    icon: <Layers className="w-8 h-8 text-purple-500" />,
  },
  {
    id: 4,
    title: "Microseeding",
    category: "Optimization",
    description: "Random Matrix Microseeding to encourage nucleation.",
    plateType: "INTELLI-PLATE 96-3",
    icon: <TestTube2 className="w-8 h-8 text-green-500" />,
  },
  {
    id: 5,
    title: "Additive Screen",
    category: "Optimization",
    description: "Add precipitants to wells.",
    plateType: "INTELLI-PLATE 96-2",
    icon: <FlaskConical className="w-8 h-8 text-orange-500" />,
  },
  {
    id: 6,
    title: "Custom Protocol",
    category: "Manual",
    description: "Build a liquid handling protocol from scratch.",
    plateType: "Any",
    icon: <Settings className="w-8 h-8 text-gray-500" />,
  },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeScreen, setActiveScreen] = useState("selection");
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(
    null
  );
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Deck plate states
  const [targetPlate, setTargetPlate] = useState("INTELLI-PLATE 96-2");
  const [screenPlate, setScreenPlate] = useState("Hampton Index Screen");

  const [volumes, setVolumes] = useState<Volumes>({
    reservoir: "50",
    protein1: "200",
    screen1: "200",
    protein2: "0",
    screen2: "0",
    protein3: "0",
    screen3: "0",
  });

  const [advancedSettings, setAdvancedSettings] =
    useState<AdvancedSettingsType>({
      headLiquidClass: "Standard Aqueous",
      headWashVolume: "500",
      headWashCycles: "3",
      nanoLiquidClass: "Protein/Viscous",
      nanoWashTime: "2.5",
      nanoDispenseSpeed: "Medium",
    });

  const handleVolumeChange = (field: keyof Volumes, value: string) => {
    setVolumes((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdvancedSettingChange = (
    field: keyof AdvancedSettingsType,
    value: string
  ) => {
    setAdvancedSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput === "admin") {
      // Mock password
      setIsAuthenticated(true);
      setShowPasswordPrompt(false);
      setShowAdvancedSettings(true);
    } else {
      setPasswordError(true);
    }
  };

  const filteredProtocols = protocols.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamically calculate which wells should be highlighted green based on > 0 volume
  const parseVol = (v: string) => parseFloat(v) || 0;
  const drop1Class =
    parseVol(volumes.protein1) > 0 || parseVol(volumes.screen1) > 0
      ? "bg-green-400 border-green-500"
      : "bg-white border-slate-300";
  const drop2Class =
    parseVol(volumes.protein2) > 0 || parseVol(volumes.screen2) > 0
      ? "bg-green-400 border-green-500"
      : "bg-white border-slate-300";
  const drop3Class =
    parseVol(volumes.protein3) > 0 || parseVol(volumes.screen3) > 0
      ? "bg-green-400 border-green-500"
      : "bg-white border-slate-300";
  const reservoirClass =
    parseVol(volumes.reservoir) > 0
      ? "bg-green-400 border-green-500"
      : "bg-white border-slate-300";
  const screenWellClass =
    parseVol(volumes.screen1) > 0 ||
    parseVol(volumes.screen2) > 0 ||
    parseVol(volumes.screen3) > 0 ||
    parseVol(volumes.reservoir) > 0
      ? "bg-green-400 border-green-500"
      : "bg-white border-slate-300";

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 relative">
      {/* Sidebar Navigation */}
      <div className="w-24 bg-slate-900 text-slate-400 flex flex-col items-center py-8 space-y-8 z-10">
        <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg mb-4">
          <Beaker className="w-8 h-8" />
        </div>

        <button className="flex flex-col items-center space-y-1 text-white hover:text-blue-400 transition-colors">
          <Power className="w-6 h-6" />
          <span className="text-xs font-medium">Initialize</span>
        </button>

        <button className="flex flex-col items-center space-y-1 hover:text-white transition-colors">
          <Box className="w-6 h-6" />
          <span className="text-xs font-medium">Labware</span>
        </button>

        <button className="flex flex-col items-center space-y-1 hover:text-white transition-colors">
          <Grid className="w-6 h-6" />
          <span className="text-xs font-medium">Screens</span>
        </button>

        <button className="flex flex-col items-center space-y-1 hover:text-white transition-colors">
          <Play className="w-6 h-6" />
          <span className="text-xs font-medium">Run</span>
        </button>

        <div className="mt-auto pt-8">
          <button className="flex flex-col items-center space-y-1 hover:text-white transition-colors">
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center shadow-sm z-10">
          {activeScreen === "selection" ? (
            <>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Select Protocol
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Choose a standard crystallization method or create a custom
                  run.
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search protocols..."
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium text-slate-600">
                    System Idle
                  </span>
                </div>

                <div className="flex items-center border-l border-slate-200 pl-6 h-10">
                  {!logoError ? (
                    <img
                      src="hla.jpg"
                      alt="Hudson Lab Automation"
                      className="h-8 object-contain"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <div className="flex flex-col items-start justify-center">
                      <div
                        className="text-[22px] font-black text-[#2B2F6C] tracking-tight leading-none flex items-baseline"
                        style={{ fontFamily: "Arial, sans-serif" }}
                      >
                        <span className="text-[#5AA647] text-[24px] mr-[1px]">
                          H
                        </span>
                        udson
                      </div>
                      <div className="text-[8px] font-bold text-[#2B2F6C] tracking-[0.2em] mt-0.5">
                        LAB AUTOMATION
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveScreen("selection")}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {selectedProtocol?.title}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Deck Setup & Verification
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setActiveScreen("selection")}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm">
                  <Play className="w-4 h-4" />
                  <span>Start Protocol</span>
                </button>

                <div className="flex items-center border-l border-slate-200 pl-6 h-10">
                  {!logoError ? (
                    <img
                      src="hla.jpg"
                      alt="Hudson Lab Automation"
                      className="h-8 object-contain"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <div className="flex flex-col items-start justify-center">
                      <div
                        className="text-[22px] font-black text-[#2B2F6C] tracking-tight leading-none flex items-baseline"
                        style={{ fontFamily: "Arial, sans-serif" }}
                      >
                        <span className="text-[#5AA647] text-[24px] mr-[1px]">
                          H
                        </span>
                        udson
                      </div>
                      <div className="text-[8px] font-bold text-[#2B2F6C] tracking-[0.2em] mt-0.5">
                        LAB AUTOMATION
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </header>

        {/* Protocol Grid */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50 relative z-0">
          {activeScreen === "selection" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProtocols.map((protocol) => (
                  <div
                    key={protocol.id}
                    onClick={() => {
                      setSelectedProtocol(protocol);
                      setTargetPlate(
                        protocol.plateType === "Any"
                          ? "INTELLI-PLATE 96-2"
                          : protocol.plateType
                      );
                      setActiveScreen("deckSetup");
                    }}
                    className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-50 rounded-lg group-hover:scale-110 transition-transform">
                        {protocol.icon}
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {protocol.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {protocol.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 flex-1">
                      {protocol.description}
                    </p>

                    <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                      <div className="flex flex-col text-right">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                          Plate Type
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                          {protocol.plateType}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProtocols.length === 0 && (
                <div className="text-center py-20">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">
                    No protocols found
                  </h3>
                  <p className="text-slate-500">
                    Try adjusting your search terms.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-8 h-full">
              {/* Deck Layout Visualization */}
              <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                <h2 className="text-lg font-semibold text-slate-700 mb-6 flex items-center shrink-0">
                  <Grid className="w-5 h-5 mr-2" />
                  Instrument Deck Map
                </h2>

                <div className="flex-1 bg-slate-200 rounded-xl border-4 border-slate-300 p-8 flex flex-row items-start justify-center gap-12 relative shadow-inner overflow-auto">
                  {/* Position 1 (Target Plate on Left) */}
                  <div className="flex flex-col items-center shrink-0">
                    <span className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">
                      Position 1
                    </span>
                    <div className="w-[28rem] h-[40rem] bg-white rounded-lg shadow-xl border border-slate-300 p-4 flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-slate-200 text-slate-600 text-[10px] px-3 py-1.5 rounded-bl-lg font-medium z-10">
                        Target Plate
                      </div>

                      {/* Target Plate Dropdown */}
                      <div className="flex justify-center mb-3 mt-2">
                        <select
                          value={targetPlate}
                          onChange={(e) => setTargetPlate(e.target.value)}
                          className="text-slate-800 font-bold text-lg bg-white/50 border border-slate-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm text-center"
                        >
                          <option value="INTELLI-PLATE 96-2">
                            INTELLI-PLATE 96-2
                          </option>
                          <option value="INTELLI-PLATE 96-3">
                            INTELLI-PLATE 96-3
                          </option>
                          <option value="SwissSci">SwissSci</option>
                        </select>
                      </div>

                      <div className="flex-1 grid grid-cols-[2rem_repeat(8,1fr)] grid-rows-[2rem_repeat(12,1fr)] gap-1 p-1.5 bg-slate-200 rounded border-2 border-slate-300">
                        {/* Top-left empty corner */}
                        <div></div>
                        {/* Column labels (H-A) */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={`col-${i}`}
                            className="flex items-center justify-center text-slate-500 text-sm font-bold"
                          >
                            {String.fromCharCode(72 - i)}
                          </div>
                        ))}
                        {/* Rows (1-12) */}
                        {Array.from({ length: 12 }).map((_, rowIdx) => (
                          <React.Fragment key={`row-${rowIdx}`}>
                            {/* Row label */}
                            <div className="flex items-center justify-center text-slate-500 text-sm font-bold">
                              {rowIdx + 1}
                            </div>
                            {/* 8 wells for this row */}
                            {Array.from({ length: 8 }).map((_, colIdx) => (
                              <div
                                key={`well-${rowIdx}-${colIdx}`}
                                className="flex flex-col p-[2px] bg-slate-100 border border-slate-300 rounded-sm w-full h-full"
                              >
                                {targetPlate === "INTELLI-PLATE 96-3" ? (
                                  <>
                                    {/* 3 horizontal drops on top */}
                                    <div className="flex w-full h-[35%] gap-[1px] mb-[2px]">
                                      <div
                                        className={`flex-1 rounded-full border shadow-sm ${drop1Class}`}
                                      ></div>
                                      <div
                                        className={`flex-1 rounded-full border shadow-sm ${drop2Class}`}
                                      ></div>
                                      <div
                                        className={`flex-1 rounded-full border shadow-sm ${drop3Class}`}
                                      ></div>
                                    </div>
                                    <div
                                      className={`flex-1 rounded-full border w-full shadow-sm ${reservoirClass}`}
                                    ></div>
                                  </>
                                ) : targetPlate === "SwissSci" ? (
                                  <>
                                    {/* 2 slightly spaced drops for SwissSci styling */}
                                    <div className="flex w-full h-[45%] gap-[3px] mb-[2px] justify-center items-center">
                                      <div
                                        className={`w-[45%] h-full rounded-full border shadow-sm ${drop1Class}`}
                                      ></div>
                                      <div
                                        className={`w-[45%] h-full rounded-full border shadow-sm ${drop2Class}`}
                                      ></div>
                                    </div>
                                    <div
                                      className={`flex-1 rounded-md border w-full shadow-sm ${reservoirClass}`}
                                    ></div>
                                  </>
                                ) : (
                                  <>
                                    {/* Default 96-2: 2 horizontal drops on top */}
                                    <div className="flex w-full h-[40%] gap-[2px] mb-[2px]">
                                      <div
                                        className={`flex-1 rounded-full border shadow-sm ${drop1Class}`}
                                      ></div>
                                      <div
                                        className={`flex-1 rounded-full border shadow-sm ${drop2Class}`}
                                      ></div>
                                    </div>
                                    <div
                                      className={`flex-1 rounded-full border w-full shadow-sm ${reservoirClass}`}
                                    ></div>
                                  </>
                                )}
                              </div>
                            ))}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Position 2 (Screen Plate on Right) */}
                  <div className="flex flex-col items-center shrink-0">
                    <span className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">
                      Position 2
                    </span>
                    <div className="w-[28rem] h-[40rem] bg-white rounded-lg shadow-xl border border-slate-300 p-4 flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-slate-200 text-slate-600 text-[10px] px-3 py-1.5 rounded-bl-lg font-medium z-10">
                        Screen Block
                      </div>

                      {/* Screen Block Dropdown */}
                      <div className="flex justify-center mb-3 mt-2">
                        <select
                          value={screenPlate}
                          onChange={(e) => setScreenPlate(e.target.value)}
                          className="text-slate-800 font-bold text-lg bg-white/50 border border-slate-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm text-center"
                        >
                          <option value="Hampton Index Screen">
                            Hampton Index Screen
                          </option>
                          <option value="JCSG Plus Screen">
                            JCSG Plus Screen
                          </option>
                          <option value="PACT Premier">PACT Premier</option>
                          <option value="Custom Screen Block">
                            Custom Screen Block
                          </option>
                        </select>
                      </div>

                      <div className="flex-1 grid grid-cols-[2rem_repeat(8,1fr)] grid-rows-[2rem_repeat(12,1fr)] gap-1.5 p-2 bg-slate-200 rounded border-2 border-slate-300">
                        {/* Top-left empty corner */}
                        <div></div>
                        {/* Column labels (H-A) */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={`col-${i}`}
                            className="flex items-center justify-center text-slate-500 text-sm font-bold"
                          >
                            {String.fromCharCode(72 - i)}
                          </div>
                        ))}
                        {/* Rows (1-12) */}
                        {Array.from({ length: 12 }).map((_, rowIdx) => (
                          <React.Fragment key={`row-${rowIdx}`}>
                            {/* Row label */}
                            <div className="flex items-center justify-center text-slate-500 text-sm font-bold">
                              {rowIdx + 1}
                            </div>
                            {/* 8 wells for this row */}
                            {Array.from({ length: 8 }).map((_, colIdx) => (
                              <div
                                key={`well-${rowIdx}-${colIdx}`}
                                className={`rounded-full border w-full h-full shadow-sm ${screenWellClass}`}
                              ></div>
                            ))}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements & Configuration Panel */}
              <div className="w-96 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full shrink-0">
                <div className="p-6 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
                  <h3 className="font-bold text-slate-800">
                    Protocol Configuration
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Set volumes and verify materials
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* Volume Settings */}
                  <div className="p-6 border-b border-slate-100 space-y-6">
                    {/* Reservoir */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                        <Droplet className="w-4 h-4 mr-2 text-blue-500" />
                        Reservoir
                      </h4>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-slate-600">Volume</label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            className="w-20 text-right border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={volumes.reservoir}
                            onChange={(e) =>
                              handleVolumeChange("reservoir", e.target.value)
                            }
                          />
                          <span className="ml-2 text-sm text-slate-500 w-6">
                            µL
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Drop 1 */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                        <Droplet className="w-4 h-4 mr-2 text-teal-500" />
                        Well 1 (First Drop)
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-slate-600">
                            Protein Volume
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="w-20 text-right border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={volumes.protein1}
                              onChange={(e) =>
                                handleVolumeChange("protein1", e.target.value)
                              }
                            />
                            <span className="ml-2 text-sm text-slate-500 w-6">
                              nL
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-slate-600">
                            Screen Volume
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="w-20 text-right border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={volumes.screen1}
                              onChange={(e) =>
                                handleVolumeChange("screen1", e.target.value)
                              }
                            />
                            <span className="ml-2 text-sm text-slate-500 w-6">
                              nL
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Drop 2 */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                        <Droplet className="w-4 h-4 mr-2 text-indigo-500" />
                        Well 2 (Second Drop)
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-slate-600">
                            Protein Volume
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="w-20 text-right border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={volumes.protein2}
                              onChange={(e) =>
                                handleVolumeChange("protein2", e.target.value)
                              }
                            />
                            <span className="ml-2 text-sm text-slate-500 w-6">
                              nL
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-slate-600">
                            Screen Volume
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="w-20 text-right border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={volumes.screen2}
                              onChange={(e) =>
                                handleVolumeChange("screen2", e.target.value)
                              }
                            />
                            <span className="ml-2 text-sm text-slate-500 w-6">
                              nL
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Drop 3 (Only visible if 96-3 is selected) */}
                    {targetPlate === "INTELLI-PLATE 96-3" && (
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                          <Droplet className="w-4 h-4 mr-2 text-purple-500" />
                          Well 3 (Third Drop)
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-slate-600">
                              Protein Volume
                            </label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                className="w-20 text-right border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={volumes.protein3}
                                onChange={(e) =>
                                  handleVolumeChange("protein3", e.target.value)
                                }
                              />
                              <span className="ml-2 text-sm text-slate-500 w-6">
                                nL
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-slate-600">
                              Screen Volume
                            </label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                className="w-20 text-right border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={volumes.screen3}
                                onChange={(e) =>
                                  handleVolumeChange("screen3", e.target.value)
                                }
                              />
                              <span className="ml-2 text-sm text-slate-500 w-6">
                                nL
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Checklist */}
                  <div className="p-6 space-y-6">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">
                      Pre-Run Checklist
                    </h4>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {targetPlate}
                        </p>
                        <p className="text-xs text-slate-500">
                          Place in Deck Position 1. Verify H1 orientation is at
                          top left.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {screenPlate}
                        </p>
                        <p className="text-xs text-slate-500">
                          Place in Deck Position 2. Ensure foil seal is pierced
                          or removed.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          Liquid System Primed
                        </p>
                        <p className="text-xs text-slate-500">
                          Verify system liquid bottles have sufficient volume
                          and lines are primed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Settings Button Area */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        setShowAdvancedSettings(true);
                      } else {
                        setShowPasswordPrompt(true);
                        setPasswordError(false);
                        setPasswordInput("");
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    Advanced Settings
                    {!isAuthenticated && (
                      <Lock className="w-3 h-3 text-slate-400 ml-1" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <Lock className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Authentication Required
              </h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-6">
              <p className="text-sm text-slate-600 mb-4">
                Please enter the administrator password to access advanced
                settings.
              </p>
              <input
                type="password"
                autoFocus
                placeholder="Password (hint: admin)"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  passwordError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:ring-blue-500"
                }`}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
              />
              {passwordError && (
                <p className="text-xs text-red-500 mt-2">
                  Incorrect password. Please try again.
                </p>
              )}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordPrompt(false)}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advanced Settings Modal */}
      {showAdvancedSettings && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  Advanced Protocol Settings
                </h3>
              </div>
              <button
                onClick={() => setShowAdvancedSettings(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-8 flex-1 overflow-y-auto">
              {/* Head Settings Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Head Parameters
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-600">
                      Head Liquid Class
                    </label>
                    <select
                      className="w-48 border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={advancedSettings.headLiquidClass}
                      onChange={(e) =>
                        handleAdvancedSettingChange(
                          "headLiquidClass",
                          e.target.value
                        )
                      }
                    >
                      <option value="Standard Aqueous">Standard Aqueous</option>
                      <option value="Viscous">Viscous</option>
                      <option value="Volatile">Volatile</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-600">
                      Head Wash Volume
                    </label>
                    <div className="flex items-center w-48">
                      <input
                        type="number"
                        className="flex-1 text-right border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={advancedSettings.headWashVolume}
                        onChange={(e) =>
                          handleAdvancedSettingChange(
                            "headWashVolume",
                            e.target.value
                          )
                        }
                      />
                      <span className="ml-2 text-sm text-slate-500 w-6">
                        µL
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-600">
                      Head Wash Cycles
                    </label>
                    <div className="flex items-center w-48">
                      <input
                        type="number"
                        className="flex-1 text-right border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={advancedSettings.headWashCycles}
                        onChange={(e) =>
                          handleAdvancedSettingChange(
                            "headWashCycles",
                            e.target.value
                          )
                        }
                      />
                      <span className="ml-2 text-sm text-slate-500 w-6"></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nano Settings Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Nano Parameters
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-600">
                      Nano Liquid Class
                    </label>
                    <select
                      className="w-48 border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={advancedSettings.nanoLiquidClass}
                      onChange={(e) =>
                        handleAdvancedSettingChange(
                          "nanoLiquidClass",
                          e.target.value
                        )
                      }
                    >
                      <option value="Protein/Viscous">Protein/Viscous</option>
                      <option value="Standard Aqueous">Standard Aqueous</option>
                      <option value="High Salt">High Salt</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-600">
                      Nano Wash Time
                    </label>
                    <div className="flex items-center w-48">
                      <input
                        type="number"
                        step="0.1"
                        className="flex-1 text-right border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={advancedSettings.nanoWashTime}
                        onChange={(e) =>
                          handleAdvancedSettingChange(
                            "nanoWashTime",
                            e.target.value
                          )
                        }
                      />
                      <span className="ml-2 text-sm text-slate-500 w-6">
                        sec
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-600">
                      Nano Dispense Speed
                    </label>
                    <select
                      className="w-48 border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={advancedSettings.nanoDispenseSpeed}
                      onChange={(e) =>
                        handleAdvancedSettingChange(
                          "nanoDispenseSpeed",
                          e.target.value
                        )
                      }
                    >
                      <option value="Slow">Slow</option>
                      <option value="Medium">Medium</option>
                      <option value="Fast">Fast</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setShowAdvancedSettings(false)}
                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAdvancedSettings(false)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
