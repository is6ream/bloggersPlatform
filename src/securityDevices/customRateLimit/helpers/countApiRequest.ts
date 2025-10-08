import { rateLimitCollection } from "../../../db/mongo.db";

export async function countApiRequest(ip: string, url: string) {
  //функция, которая считает запросы
  const tenSecondsAgo = new Date(Date.now() - 10000);
  const count = await rateLimitCollection.countDocuments({
    ip: ip,
    url: url,
    date: { $gt: tenSecondsAgo }, //считает документы, которые были записаны в коллекцию за последние 10 секунд
  });
  return count > 5;
}
