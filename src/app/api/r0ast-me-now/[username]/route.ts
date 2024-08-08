import fs from 'fs'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const fetchUser = async (username: string) => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/user/${username}.json`);
  const userData = await response.json();
  if (!userData) {
    return null;
  }
  // get only first 10 submissions from the user
  const submissionsIds = userData.submitted.slice(0, 10)
  // for each submission id, fetch the submission data
  const submissions = await Promise.all(submissionsIds.map(async (id: number) => {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    return response.json();
  }))
  userData.submitted = null
  userData.submissions = submissions
  console.log(userData)
  return userData
}

const roastUserUsingAi = async (userData: any) => {
  const posts = userData.submissions
    .filter((post: any) => post.type === 'story')
    .map((post: any) => {
      return `title: ${post.title}, score: ${post.score}`
    })
  const comments = userData.submissions
    .filter((comment: any) => comment.type === 'comment')
    .map((comment: any) => {
      return `comment: ${comment.text.substring(0, 200)}`
    })
  const prompt = `
  Generate a strong, harsh, realistic, and mind-blowing roast for the user with details given below.
  Make sure the roast content is AT LEAST 3 paragraphs long, and it is harsh and specific. Separate each paragraph with a \\n symbol.
  Give your reply in a JSON object with 3 properties: roastText, strengthsText, weaknessesText.
  User details:
  username: ${userData.id}
  about: ${userData.about}
  karma: ${userData.karma}
  created: ${userData.created}
  ${posts.length > 0 ? `posts: ${posts.join('\n')}` : ''}
  ${comments.length > 0 ? `comments: ${comments.join('\n')}` : ''}
  `
  try {
    const roast = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: "json_object" }
    })
    return JSON.parse(roast.choices[0].message.content || '{}')
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function GET(req: Request, { params }: { params: { username: string } }) {
  // if roast.txt exists, use it
  if (fs.existsSync('roast.txt')) {
    const roast = fs.readFileSync('roast.txt', 'utf8');
    return Response.json(JSON.parse(roast));
  }
  const username = params.username;
  const user = await fetchUser(username);
  if (!user) {
    return Response.json({ error: 'User not found' });
  }
  const roast = await roastUserUsingAi(user);
  // write to file (temporarily)
  fs.writeFileSync('roast.txt', JSON.stringify({ ...user, ...roast }));
  return Response.json({
    ...user,
    ...roast,
  });
}