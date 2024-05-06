export async function POST(sessionToken: Request) {
    const sessionTokenValue = await sessionToken.json()
    if (!sessionTokenValue) {
      return Response.json(
        { message: 'Không nhận được session token' },
        {
          status: 400
        }
      )
    }
    return Response.json(sessionTokenValue, {
      status: 200,
      headers: {
        'Set-Cookie': `sessionToken=${sessionTokenValue}; Path=/; SameSite=Lax; Secure; HttpOnly;`
      }
    })
}