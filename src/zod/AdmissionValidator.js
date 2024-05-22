import { z } from "zod";

export const AdmissionSchema = z.object({
	admissionYear: z.number().int().positive().required(),
	branch: z.string().min(1).required(),
	semester: z.string().min(1).required(),
	admissionType: z.string().min(1).required(),
	category: z.string().min(1).required(),
	usn: z.string().min(1).required(),
	collegeID: z.number().int().positive().required(),
	documentsSubmitted: z.array(z.string()).optional(),
	changeOfBranch: z
		.object({
			year: z.number().int().positive().optional(),
			newBranch: z.string().min(1).optional(),
			usn: z.string().min(1).optional(),
			collegeID: z.number().int().positive().optional(),
		})
		.optional(),
});

export default AdmissionSchema;
