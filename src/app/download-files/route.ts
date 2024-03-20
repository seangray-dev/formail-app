import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileId = searchParams.get('fileId');
  // console.log(fileId);
  // // Replace this with your actual logic to retrieve the file based on fileId
  // const fileData = await getFileData(fileId);
  // const headers = new Headers({
  //   'Content-Type': 'application/octet-stream', // or the actual content type of your file
  //   'Content-Disposition': `attachment; filename="${fileData.fileName}"`,
  // });
  // return new Response(fileData.content, { headers });
  return new Response(fileId);
}
