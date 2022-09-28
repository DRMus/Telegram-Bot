const TelegramApi = require("node-telegram-bot-api");

const token = "5652422996:AAEcEdSQW4aEHIqtFt3npB7NZhraOfxc3qI";

const bot = new TelegramApi(token, { polling: true });

const questions = [
  "\u{2753} К наиболее общим типам операндов нельзя отнести:",
  "\u{2753} Какие признаки (флаги) формируются в АЛУ при выполнении арифметических и логических операций?",
  "\u{2753} Верно ли утверждение, что достоинствами представления чисел в формате с фиксированной запятой являются простота и наглядность представления чисел, а также простота алгоритмов реализации арифметических операций?",
  "\u{2753} Выберите прием, повышающий способ представления мантиссы в формате чисел с плавающей запятой:",
  "\u{2753} Для всех языков программирования характерно интенсивное использование механизма.",
  "\u{2753} Верно ли утверждение, что аббревиатура SIMD обозначает много данных – одна инструкция?",
];

var result = 0;

const answers = [
  [
    { text: "Адреса", validate: false },
    { text: "Ссылки", validate: true },
    { text: "Числа", validate: false },
    { text: "Символы", validate: false },
  ],
  [
    { text: "Флаг нуля", validate: false },
    { text: "флаг переполнения", validate: false },
    { text: "флаг знака", validate: false },
    { text: "флаг переноса", validate: false },
    { text: "все перечисленные выше", validate: true },
  ],
  [
    {
      text: "Верно",
      validate: true,
    },
    {
      text: "Неверно",
      validate: false,
    },
  ],
  [
    { text: "прием скрытой единицы", validate: true },
    { text: "нормализации мантиссы справа", validate: false },
    { text: "нормализация мантиссы слева", validate: false },
  ],
  [
    { text: "процедур", validate: true },
    {
      text: "сортировки",
      validate: false,
    },
    { text: "классов", validate: false },
    { text: "функций", validate: false },
  ],
  [
    { text: "Верно", validate: false },
    { text: "Неверно", validate: true },
  ]
];
var indexQuest = 0;

const startTest = async (chatId, right) => {
  if (right) {
    await bot.sendMessage(chatId, "Верно");
  }
  await bot.sendMessage(chatId, questions[indexQuest]);

  var answersForQuestions = [];
  answers[indexQuest].map((a) => {
    answersForQuestions.push([
      { text: a.text, callback_data: a.validate.toString() },
    ]);
  });

  const gameOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: answersForQuestions,
    }),
  };
  return await bot.sendMessage(chatId, "Выберите ответ", gameOptions);
};

const start = async () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/testing", description: "Тестирование по дисциплинам" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    try {
      if (text === "/start") {
        return bot.sendMessage(
          chatId,
          `Добро пожаловать в бот, который протестирует ваши знание ЭВМ`
        );
      }
      if (text === "/info") {
        return bot.sendMessage(
          chatId,
          `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
        );
      }
      if (text === "/testing") {
        return startTest(chatId, indexQuest);
      }
      return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!)");
    } catch (e) {
      return bot.sendMessage(chatId, `Произошла ошибка ${e}`);
    }
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (indexQuest + 1 < questions.length) {
      indexQuest += 1;
      if (data === "true") {
        result += 1;
        return startTest(chatId, true);
      } else {
        return startTest(chatId);
      }
    } else {
      await bot.sendMessage(
        chatId,
        `\u{2714} Вы ответили верно на ${result} вопросов из ${questions.length}`
      );
      indexQuest = 0;
    }
  });
};

start();
