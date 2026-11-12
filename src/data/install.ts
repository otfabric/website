// The command-line tools that https://get.otfabric.io installs, from tools.json in
// github.com/otfabric/install. Keep this list in step with that registry.

export const installHost = 'https://get.otfabric.io';
export const installerRepo = 'https://github.com/otfabric/install';

export interface Tool {
	/** Installer name: https://get.otfabric.io/<tool>. */
	tool: string;
	/** Repository under github.com/otfabric. */
	repo: string;
	/** `cli`: a repository of its own. `embedded`: ships inside a library repository. */
	kind: 'cli' | 'embedded';
	protocol: string;
	summary: string;
	/** Catalog page under /projects/. */
	project: string;
	/** Docs page for the tool, where there is one. */
	docs?: string;
	/** How to build it from source instead, when someone wants to. */
	source: string;
}

const goInstall = (path: string) => `go install github.com/otfabric/${path}@latest`;
const checkout = 'make build in a checkout (nested module, so no go install)';

export const tools: Tool[] = [
	{ tool: 'bacnetctl', repo: 'bacnetctl', kind: 'cli', protocol: 'BACnet', summary: 'BACnet/IP discovery, property read and write, COV, alarms, BBMD and a simulated device.', project: 'bacnetctl', docs: '/docs/protocols/bacnet/cli/', source: goInstall('bacnetctl') },
	{ tool: 'canbusctl', repo: 'canbusctl', kind: 'cli', protocol: 'CAN bus', summary: 'CAN, CAN FD and CAN XL: monitor, decode, record, replay, ISO-TP and simulation.', project: 'canbusctl', docs: '/docs/protocols/can-bus/cli/', source: goInstall('canbusctl') },
	{ tool: 'canopenctl', repo: 'canopenctl', kind: 'cli', protocol: 'CANopen', summary: 'CANopen SDO, PDO, NMT, LSS, EMCY, EDS and DCF, CiA 402 drives and device simulation.', project: 'canopenctl', docs: '/docs/protocols/canopen/cli/', source: goInstall('canopenctl') },
	{ tool: 'dnp3ctl', repo: 'dnp3ctl', kind: 'cli', protocol: 'DNP3', summary: 'DNP3 polling, control, discovery, file transfer and a simulated outstation.', project: 'dnp3ctl', docs: '/docs/protocols/dnp3/cli/', source: goInstall('dnp3ctl') },
	{ tool: 'ethernetipctl', repo: 'ethernetipctl', kind: 'cli', protocol: 'EtherNet/IP', summary: 'EtherNet/IP discovery, attributes, cyclic I/O, Logix tags, EDS and adapter simulation.', project: 'ethernetipctl', docs: '/docs/protocols/ethernet-ip/cli/', source: goInstall('ethernetipctl') },
	{ tool: 'iec101ctl', repo: 'iec60870ctl', kind: 'cli', protocol: 'IEC 60870-5-101', summary: 'IEC 101 on a serial line or terminal server: interrogate, monitor, command, unbalanced or balanced, and a simulated station.', project: 'iec101ctl', docs: '/docs/protocols/iec-101/cli/', source: goInstall('iec60870ctl/cmd/iec101ctl') },
	{ tool: 'iec102ctl', repo: 'iec60870ctl', kind: 'cli', protocol: 'IEC 60870-5-102', summary: 'IEC 102 meters: integrated totals, events, the clock and the REE profile, and a simulated meter.', project: 'iec102ctl', docs: '/docs/protocols/iec-102/cli/', source: goInstall('iec60870ctl/cmd/iec102ctl') },
	{ tool: 'iec103ctl', repo: 'iec60870ctl', kind: 'cli', protocol: 'IEC 60870-5-103', summary: 'IEC 103 protection relays: interrogation, commands, generic services, disturbance data and a simulated relay.', project: 'iec103ctl', docs: '/docs/protocols/iec-103/cli/', source: goInstall('iec60870ctl/cmd/iec103ctl') },
	{ tool: 'iec104ctl', repo: 'iec60870ctl', kind: 'cli', protocol: 'IEC 60870-5-104', summary: 'IEC 104 interrogation, monitoring, commands, file transfer and a simulated RTU.', project: 'iec104ctl', docs: '/docs/protocols/iec-104/cli/', source: goInstall('iec60870ctl/cmd/iec104ctl') },
	{ tool: 'iec61850ctl', repo: 'iec61850ctl', kind: 'cli', protocol: 'IEC 61850', summary: 'IEC 61850 MMS, GOOSE and Sampled Values: browse IEDs, control, reports and SCL.', project: 'iec61850ctl', docs: '/docs/protocols/iec-61850/cli/', source: goInstall('iec61850ctl') },
	{ tool: 'ieee20305ctl', repo: 'ieee20305ctl', kind: 'cli', protocol: 'IEEE 2030.5', summary: 'IEEE 2030.5 device and server roles, registration, controls, certificates and a test server.', project: 'ieee20305ctl', docs: '/docs/protocols/ieee-2030-5/cli/', source: goInstall('ieee20305ctl') },
	{ tool: 'knxctl', repo: 'knxctl', kind: 'cli', protocol: 'KNX', summary: 'KNXnet/IP discovery, tunnelling, routing, group monitoring, datapoint types and simulation.', project: 'knxctl', docs: '/docs/protocols/knx/cli/', source: goInstall('knxctl') },
	{ tool: 'mbcapctl', repo: 'go-modbus-capture', kind: 'embedded', protocol: 'Modbus', summary: 'Inspect, convert and validate MBCAP Modbus capture files.', project: 'go-modbus-capture', docs: '/docs/protocols/modbus/captures/', source: goInstall('go-modbus-capture/cmd/mbcapctl') },
	{ tool: 'mbtracectl', repo: 'go-modbus-trace', kind: 'embedded', protocol: 'Modbus', summary: 'Analyse Modbus/TCP traffic in pcap and pcapng traces and export MBCAP.', project: 'go-modbus-trace', docs: '/docs/protocols/modbus/captures/', source: checkout },
	{ tool: 'modbus-cli', repo: 'go-modbus', kind: 'embedded', protocol: 'Modbus', summary: 'Minimal Modbus TCP and RTU client for quick probing and troubleshooting.', project: 'go-modbus', docs: '/docs/protocols/modbus/library/', source: checkout },
	{ tool: 'modbusctl', repo: 'modbusctl', kind: 'cli', protocol: 'Modbus', summary: 'Modbus discovery, scanning, fingerprinting, SunSpec, recording, replay and simulation.', project: 'modbusctl', docs: '/docs/protocols/modbus/cli/', source: 'make build in a checkout' },
	{ tool: 'nsdctl', repo: 'go-iec61850-model', kind: 'embedded', protocol: 'IEC 61850', summary: 'Look up, inspect and validate IEC 61850 logical nodes and NSD packages.', project: 'nsdctl', docs: '/docs/models/iec-61850/cli/', source: checkout },
	{ tool: 'ocppctl', repo: 'ocppctl', kind: 'cli', protocol: 'OCPP', summary: 'OCPP 1.6J, 2.0.1 and 2.1: probe a CSMS, simulate stations and serve a test CSMS.', project: 'ocppctl', docs: '/docs/protocols/ocpp/cli/', source: goInstall('ocppctl') },
	{ tool: 'opcuactl', repo: 'opcuactl', kind: 'cli', protocol: 'OPC UA', summary: 'OPC UA discovery, browse, read and write, subscriptions, alarms, history and PubSub.', project: 'opcuactl', docs: '/docs/protocols/opc-ua/cli/', source: goInstall('opcuactl') },
	{ tool: 'openadrctl', repo: 'openadrctl', kind: 'cli', protocol: 'OpenADR', summary: 'OpenADR 3 VEN and Business Logic clients, notifications and a test VTN.', project: 'openadrctl', docs: '/docs/protocols/openadr/cli/', source: goInstall('openadrctl') },
	{ tool: 'otprobe', repo: 'go-otfp', kind: 'embedded', protocol: 'Multi-protocol', summary: 'Find out which OT protocol an endpoint speaks, and which device answers.', project: 'otprobe', source: checkout },
	{ tool: 'profinetctl', repo: 'profinetctl', kind: 'cli', protocol: 'PROFINET', summary: 'PROFINET discovery, DCP naming, I&M, diagnosis, topology, GSDML and cyclic I/O.', project: 'profinetctl', docs: '/docs/protocols/profinet/cli/', source: goInstall('profinetctl') },
	{ tool: 's7commctl', repo: 's7commctl', kind: 'cli', protocol: 'Siemens S7', summary: 'S7 PLC discovery, rack and slot probing, memory read and write, blocks and diagnostics.', project: 's7commctl', docs: '/docs/protocols/s7/cli/', source: 'make build in a checkout' },
	{ tool: 'sclgen', repo: 'go-iec61850', kind: 'embedded', protocol: 'IEC 61850', summary: 'Generate Go types from IEC 61850 SCL schema bundles.', project: 'go-iec61850', docs: '/docs/protocols/iec-61850/library/', source: checkout },
	{ tool: 'sclparse', repo: 'go-iec61850', kind: 'embedded', protocol: 'IEC 61850', summary: 'Detect, summarise and validate IEC 61850 SCL configuration files.', project: 'go-iec61850', docs: '/docs/protocols/iec-61850/library/', source: checkout },
	{ tool: 'sparkplugbctl', repo: 'sparkplugbctl', kind: 'cli', protocol: 'Sparkplug B', summary: 'Sparkplug B monitoring, publishing, payload coding and edge node and host simulation.', project: 'sparkplugbctl', docs: '/docs/profiles/sparkplugb/cli/', source: goInstall('sparkplugbctl') },
	{ tool: 'sunspecctl', repo: 'sunspecctl', kind: 'cli', protocol: 'SunSpec', summary: 'SunSpec Modbus inverters, meters and batteries: detect, read, poll and simulate.', project: 'sunspecctl', docs: '/docs/models/sunspec/cli/', source: goInstall('sunspecctl') },
];

export const toolByName = (name: string) => tools.find((t) => t.tool === name);

/** The tools a catalog project installs or ships. */
export const toolsFor = (project: string) => tools.filter((t) => t.project === project);

export const shInstall = (tool: string) => `curl -fsSL ${installHost}/${tool} | sh`;
export const psInstall = (tool: string) => `irm ${installHost}/${tool}.ps1 | iex`;
/** For CI, Dockerfiles and device images: a fixed directory, no PATH or profile changes. */
export const ciInstall = (tool: string, dir = '/usr/local/bin') => `curl -fsSL ${installHost}/${tool} | env OTF_UNMANAGED_INSTALL=${dir} sh`;
export const pinnedInstall = (tool: string, version = 'x.y.z') => `curl -fsSL ${installHost}/${tool} | env OTF_VERSION=${version} sh`;

/** The OT Fabric exit-code table every tool follows; each tool uses the codes that apply to it. */
export const exitCodes: { code: string; meaning: string }[] = [
	{ code: '0', meaning: 'Success' },
	{ code: '1', meaning: 'Findings: the command completed and its result reports problems, such as a file that does not validate or a diagnosis with a failing check' },
	{ code: '2', meaning: 'Usage: unknown command or flag, a missing argument' },
	{ code: '3', meaning: 'Invalid input: a flag value, a file or a combination that does not make sense. Nothing was sent' },
	{ code: '4', meaning: 'Transport: the connection could not be made, or was lost' },
	{ code: '5', meaning: 'Timeout: the device did not answer in time' },
	{ code: '6', meaning: 'Protocol: the device refused the request, or broke the protocol' },
	{ code: '7', meaning: 'Partial success: a valid result was written, and it holds failures' },
	{ code: '8', meaning: 'Unsupported: the device, or this platform, does not support what was asked' },
	{ code: '9', meaning: 'Permission: the device or the operating system refused, such as raw-socket access without the capability' },
	{ code: '10', meaning: 'Output or internal error' },
	{ code: '130', meaning: 'Interrupted by Ctrl-C or SIGTERM before a result' },
];
