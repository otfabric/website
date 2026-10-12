// Catalog of OT Fabric projects. Every `available` entry is a public repository
// in github.com/otfabric; `planned` entries are roadmap items with no repo yet.

export type Category =
	| 'library'
	| 'cli'
	| 'transport'
	| 'discovery'
	| 'interop'
	| 'ui'
	| 'mcp'
	| 'gateway';

export type ProtocolId =
	| 'modbus'
	| 'opc-ua'
	| 'bacnet'
	| 'iec-104'
	| 'iec-61850'
	| 's7'
	| 'sunspec';

export interface Project {
	name: string;
	category: Category;
	description: string;
	protocols: ProtocolId[];
	status: 'available' | 'planned';
	/** Repository name in github.com/otfabric. */
	repo?: string;
	install?: string;
}

export const categories: { id: Category; label: string; description: string }[] = [
	{ id: 'library', label: 'Protocol libraries', description: 'Pure Go clients and servers. No cgo.' },
	{ id: 'cli', label: 'CLI tools', description: 'Command-line tools to discover, read, write and diagnose devices.' },
	{ id: 'transport', label: 'Building blocks', description: 'Transport layers shared by the protocol libraries.' },
	{ id: 'discovery', label: 'Discovery', description: 'Find out what is actually running on a network.' },
	{ id: 'interop', label: 'Interop suites', description: 'Dockerized reference stacks that test implementations against each other.' },
	{ id: 'ui', label: 'UI apps', description: 'Graphical applications built on the libraries.' },
	{ id: 'mcp', label: 'MCP servers', description: 'Let AI agents work with industrial devices through the Model Context Protocol.' },
	{ id: 'gateway', label: 'Gateways and connectors', description: 'Move OT data into IT, cloud and analytics systems.' },
];

export const protocols: { id: ProtocolId; label: string; page?: string }[] = [
	{ id: 'modbus', label: 'Modbus', page: '/protocols/modbus/' },
	{ id: 'opc-ua', label: 'OPC UA', page: '/protocols/opc-ua/' },
	{ id: 'bacnet', label: 'BACnet/IP', page: '/protocols/bacnet/' },
	{ id: 'iec-104', label: 'IEC 60870-5-104', page: '/protocols/iec-104/' },
	{ id: 'iec-61850', label: 'IEC 61850 / MMS' },
	{ id: 's7', label: 'Siemens S7' },
	{ id: 'sunspec', label: 'SunSpec' },
];

const goGet = (repo: string) => `go get github.com/otfabric/${repo}`;

export const projects: Project[] = [
	// Protocol libraries
	{ name: 'go-modbus', repo: 'go-modbus', category: 'library', protocols: ['modbus', 'sunspec'], status: 'available', install: goGet('go-modbus'),
		description: 'Modbus client and server: TCP, RTU, ASCII, TLS and UDP, typed register codecs, pooling and retries.' },
	{ name: 'go-opcua', repo: 'go-opcua', category: 'library', protocols: ['opc-ua'], status: 'available', install: goGet('go-opcua'),
		description: 'OPC UA client and server: secure channels, subscriptions, events, methods and historical access.' },
	{ name: 'go-bacnet', repo: 'go-bacnet', category: 'library', protocols: ['bacnet'], status: 'available', install: goGet('go-bacnet'),
		description: 'BACnet/IP client: discovery, properties, COV and alarms, routed networks and foreign-device registration.' },
	{ name: 'go-iec104', repo: 'go-iec104', category: 'library', protocols: ['iec-104'], status: 'available', install: goGet('go-iec104'),
		description: 'IEC 60870-5-104 controlling and controlled station, with the full APCI state machine and redundancy groups.' },
	{ name: 'go-iec61850', repo: 'go-iec61850', category: 'library', protocols: ['iec-61850'], status: 'available', install: goGet('go-iec61850'),
		description: 'IEC 61850 client and server with logical nodes, reports, controls and SCL as first-class Go types.' },
	{ name: 'go-mms', repo: 'go-mms', category: 'library', protocols: ['iec-61850'], status: 'available', install: goGet('go-mms'),
		description: 'MMS (ISO 9506) client and server, the transport underneath IEC 61850.' },
	{ name: 'go-s7comm', repo: 'go-s7comm', category: 'library', protocols: ['s7'], status: 'available', install: goGet('go-s7comm'),
		description: 'Siemens S7 client: read and write DBs, inputs, outputs and markers, discovery and SZL diagnostics.' },
	{ name: 'go-sunspec', repo: 'go-sunspec', category: 'library', protocols: ['sunspec', 'modbus'], status: 'available', install: goGet('go-sunspec'),
		description: 'SunSpec over Modbus: discovers 112 built-in models and decodes typed, scaled values. Includes the sunspecctl CLI.' },

	// CLI tools
	{ name: 'modbusctl', repo: 'modbusctl', category: 'cli', protocols: ['modbus', 'sunspec'], status: 'available',
		description: 'Identify, fingerprint, scan, poll, decode and write Modbus devices. Record to MCAP and replay as a simulator.' },
	{ name: 'modbus-simulator', repo: 'modbus-simulator', category: 'cli', protocols: ['modbus'], status: 'available',
		description: 'Deterministic, stateful Modbus TCP device simulator driven by JSON fixtures, for integration tests.' },
	{ name: 'opcuactl', repo: 'opcuactl', category: 'cli', protocols: ['opc-ua'], status: 'available',
		description: 'Discover, browse, read, write, call methods, monitor, read history and export from OPC UA servers.' },
	{ name: 'bacnetctl', repo: 'bacnetctl', category: 'cli', protocols: ['bacnet'], status: 'available',
		description: 'Discover BACnet devices, list point lists, read, write at priority, monitor COV and inspect alarms.' },
	{ name: 'iec104ctl', repo: 'iec104ctl', category: 'cli', protocols: ['iec-104'], status: 'available',
		description: 'Interrogate, monitor and command IEC 104 stations, transfer files, or simulate an RTU from YAML.' },
	{ name: 'iec61850ctl', repo: 'iec61850ctl', category: 'cli', protocols: ['iec-61850'], status: 'available',
		description: 'Browse IED data models, read and write, operate controls, subscribe to reports and parse SCL.' },
	{ name: 's7commctl', repo: 's7commctl', category: 'cli', protocols: ['s7'], status: 'available',
		description: 'Siemens S7 command-line client for ISO-on-TCP (port 102).' },

	// Building blocks
	{ name: 'go-cotp', repo: 'go-cotp', category: 'transport', protocols: ['s7', 'iec-61850'], status: 'available', install: goGet('go-cotp'),
		description: 'COTP TP0 transport service over RFC 1006, plus a full X.224 TPDU codec.' },
	{ name: 'go-tpkt', repo: 'go-tpkt', category: 'transport', protocols: ['s7', 'iec-61850'], status: 'available', install: goGet('go-tpkt'),
		description: 'TPKT framing for RFC 1006 and RFC 2126 transport profiles.' },
	{ name: 'go-serial', repo: 'go-serial', category: 'transport', protocols: ['modbus'], status: 'available', install: goGet('go-serial'),
		description: 'Cross-platform serial ports for RS-232 and RS-485, with a Modbus RTU preset.' },

	// Discovery
	{ name: 'go-otfp', repo: 'go-otfp', category: 'discovery', protocols: [], status: 'available', install: goGet('go-otfp'),
		description: 'OT protocol fingerprinting from transport framing and handshake behaviour, without application-layer requests.' },

	// Interop suites
	{ name: 'modbus-interop', repo: 'modbus-interop', category: 'interop', protocols: ['modbus'], status: 'available',
		description: 'Modbus TCP reference stacks: libmodbus, PyModbus, digitalpetri, NModbus and tokio-modbus.' },
	{ name: 'opcua-interop', repo: 'opcua-interop', category: 'interop', protocols: ['opc-ua'], status: 'available',
		description: 'OPC UA reference clients and servers based on open62541 and Eclipse Milo.' },
	{ name: 'bacnet-interop', repo: 'bacnet-interop', category: 'interop', protocols: ['bacnet'], status: 'available',
		description: 'BACnet/IP reference devices: BACnet Stack, BACpypes3, BACnet4J, System.IO.BACnet and Worldiety.' },
	{ name: 'iec104-interop', repo: 'iec104-interop', category: 'interop', protocols: ['iec-104'], status: 'available',
		description: 'IEC 104 reference stations: lib60870, OpenMUC j60870 and wendy512.' },
	{ name: 'mms-interop', repo: 'mms-interop', category: 'interop', protocols: ['iec-61850'], status: 'available',
		description: 'MMS and IEC 61850 adapter images for libiec61850 and IEC61850bean.' },
	{ name: 'snap7-interop', repo: 'snap7-interop', category: 'interop', protocols: ['s7'], status: 'available',
		description: 'Fixture-driven Snap7 servers (native and pure Python) for testing S7 clients.' },

	// Roadmap
	{ name: 'UI apps', category: 'ui', protocols: [], status: 'planned',
		description: 'Graphical tools built on the same libraries. None are public yet.' },
	{ name: 'OT MCP servers', category: 'mcp', protocols: [], status: 'planned',
		description: 'A structured, safe way for AI agents to discover, read and work with industrial devices.' },
	{ name: 'IT2OT gateways and connectors', category: 'gateway', protocols: [], status: 'planned',
		description: 'Move OT data safely into the IT, cloud and analytics systems that need it.' },
];

export const repoUrl = (repo: string) => `https://github.com/otfabric/${repo}`;
