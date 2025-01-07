import * as dotenv from "dotenv";
dotenv.config();
import { OpenAI } from "openai";

type Article = {
  source: {
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  content: string;
};

type News = {
  status: string;
  totalResults: number;
  articles: Array<Article>;
};

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = "gpt-4o-mini";

const getNews = async (topic: string) => {
  console.log(`Fetching news for topic: ${topic}`);
  const url = `https://newsapi.org/v2/everything?q=${topic}&apiKey=${process.env.NEWS_API_KEY}`;

  try {
    const response = await fetch(url);

    console.log("res", response);

    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }

    const news = (await response.json()) as News;

    const status: string = news.status;
    const totalResults: number = news.totalResults;
    const articles: Array<Article> = news.articles;
    const finalNews: Array<string> = [];

    for (const article of articles) {
      const sourceName = article.source.name;
      const author = article.author;
      const title = article.title;
      const description = article.description;
      const url = article.url;
      const content = article.content;

      const titleDescription = `title: ${title}, author: ${author}, source:  ${sourceName}, description: ${description}, url: ${url} `;

      finalNews.push(titleDescription);
    }

    console.log(finalNews[0]);

    return finalNews;
  } catch (e) {
    console.error("Error fetching news:", e);
    throw new Error("Something went wrong");
  }
};

(async () => {
  const news = await getNews("bitcoin");
  console.log(news);
})();
