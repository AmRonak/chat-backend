import cloudinary, {type UploadApiResponse, type UploadApiErrorResponse} from 'cloudinary';

export async function uploads(
	file: string,
	public_id?: string,
	overwrite?: boolean,
	invalidate?: boolean,
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
	return new Promise(resolve => {
		void cloudinary.v2.uploader.upload(
			file,
			{
				// eslint-disable-next-line @typescript-eslint/naming-convention
				public_id,
				overwrite,
				invalidate,
			},
			(error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
				if (error) {
					resolve(error);
				}

				resolve(result);
			},
		);
	});
}
