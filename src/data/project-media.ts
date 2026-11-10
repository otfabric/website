// Screenshots and demo videos for project pages, keyed by project id.
// Screenshots live in src/assets/projects/<id>/ so Astro optimizes them;
// videos and their posters live in public/videos/.
import type { ImageMetadata } from 'astro';
import sunspecExplorer from '../assets/projects/sunspec-explorer/inverter.png';
import modbusTraceExplorer from '../assets/projects/modbus-trace-explorer/timeline.png';
import iec61850Explorer from '../assets/projects/iec61850-explorer/live-watch.png';

export interface ProjectMedia {
	screenshot?: { src: ImageMetadata; alt: string; caption?: string };
	video?: { src: string; poster?: string; caption?: string };
}

export const projectMedia: Record<string, ProjectMedia> = {
	'sunspec-explorer': {
		screenshot: {
			src: sunspecExplorer,
			alt: 'SunSpec Explorer connected to a three-phase inverter, showing model 103 with every point decoded: label, value with units, type, scale factor, raw value and register address.',
			caption: 'Model 103 of a three-phase inverter, every point decoded with units, scale factors, raw values and register addresses.',
		},
		video: {
			src: '/videos/sunspec-explorer-demo.mp4',
			poster: '/videos/sunspec-explorer-demo.jpg',
			caption: 'One minute with SunSpec Explorer: connect, browse decoded models, poll, record and export, against a device simulated with sunspecctl serve.',
		},
	},
	'modbus-trace-explorer': {
		screenshot: {
			src: modbusTraceExplorer,
			alt: 'Modbus Trace Explorer with a ten-minute trace of six devices open: the timeline lists each transaction with time, client, server, unit, transaction ID, function and summary, and the detail pane decodes the selected Read Holding Registers response field by field with its byte ranges.',
			caption: 'The timeline: one row per transaction, request and response together, with the selected response decoded field by field down to the bytes.',
		},
		video: {
			src: '/videos/modbus-trace-explorer-demo.mp4',
			poster: '/videos/modbus-trace-explorer-demo.jpg',
			caption: 'Two minutes with Modbus Trace Explorer on a synthetic site trace: find slow devices, poll problems and wrong registers, then export a device for replay.',
		},
	},
	'iec61850-explorer': {
		screenshot: {
			src: iec61850Explorer,
			alt: 'IEC 61850 Explorer connected to a feeder IED in Observe mode: the frequency MMXU1.Hz read under FC MX with its magnitude, quality good and time stamp, the MMS item it came from and the namespace that defines it, and below it two points polled every second in the watch table.',
			caption: 'A live IED in Observe mode: a value read with its quality, time stamp and MMS item, and two points polled every second.',
		},
		video: {
			src: '/videos/iec61850-explorer-demo.mp4',
			poster: '/videos/iec61850-explorer-demo.jpg',
			caption: 'Three and a half minutes on the demo substation that ships with the Explorer: search an SCD by quantity, check conformance, compare a live IED with its CID, operate a breaker in Commission mode and analyse captures of a fault.',
		},
	},
};
