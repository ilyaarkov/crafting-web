import { CONSENT_PATH, CONSENT_VERSION } from './consentVersion.js';

export { CONSENT_PATH, CONSENT_VERSION };

export const personalDataConsent = {
  ru: {
    title: 'Согласие на обработку персональных данных',
    versionLabel: 'Редакция',
    labelPrefix: 'Я даю ',
    consentLink: 'согласие на обработку персональных данных',
    labelConnector: ' и принимаю ',
    policyLink: 'политику конфиденциальности',
    policy: 'Политика обработки персональных данных',
    newTab: 'откроется в новой вкладке',
    required: 'Чтобы отправить заявку, прочитайте согласие и отметьте чекбокс.',
    intro: 'Отмечая отдельный чекбокс и отправляя форму на сайте ilyaarkov.com, я свободно, своей волей и в своём интересе даю Илье Арькову (далее — Оператор, контакт: hello@ilyaarkov.com) согласие на обработку моих персональных данных на следующих условиях.',
    sections: [
      { title: 'Какие данные', text: 'Имя и контакт для ответа (адрес электронной почты, номер телефона или имя пользователя в мессенджере), которые я указываю в форме. Если я заполняю необязательные поля, согласие также распространяется на персональные данные в ссылке на проект и описании задачи. Не следует указывать чужие данные, сведения о здоровье, иные специальные категории персональных данных или платёжные реквизиты.' },
      { title: 'Для чего', text: 'Для рассмотрения моей заявки, связи со мной, обсуждения задачи, подготовки предложения и согласования условий проекта. Согласие не распространяется на рекламные рассылки и публикацию моих данных.' },
      { title: 'Какие действия', text: 'Сбор, запись, систематизация, хранение, уточнение, извлечение, использование для ответа на заявку, передача для доставки уведомления Оператору через Telegram, блокирование, удаление и уничтожение. Обработка может осуществляться с использованием средств автоматизации и без них. Содержание заявки и сведения о предоставленном согласии направляются Оператору сообщением через Telegram-бота. Это согласие не разрешает распространение данных неограниченному кругу лиц и не отменяет установленные законом требования к их обработке.' },
      { title: 'Срок и отзыв', text: 'Согласие действует со дня отправки формы до достижения указанных целей либо до его отзыва, если он поступит раньше. Я могу отозвать согласие, написав на hello@ilyaarkov.com с указанием контакта, использованного в заявке. Оператор прекращает обработку и удаляет данные в сроки, установленные законодательством РФ, если отсутствует иное законное основание для их обработки.' },
      { title: 'Подтверждение', text: 'Чекбокс изначально не отмечен; согласие предоставляется отдельным действием, а не самим посещением сайта или ознакомлением с политикой. Вместе с заявкой фиксируются факт согласия, редакция его текста, язык формы и серверное время получения заявки. Эти сведения используются для подтверждения получения согласия.' },
    ],
  },
  en: {
    title: 'Consent to personal data processing',
    versionLabel: 'Version',
    labelPrefix: 'I give my ',
    consentLink: 'consent to personal data processing',
    labelConnector: ' and accept the ',
    policyLink: 'privacy policy',
    policy: 'Personal data processing policy',
    newTab: 'opens in a new tab',
    required: 'To submit your request, read the consent and select the checkbox.',
    intro: 'By selecting the separate checkbox and submitting the form on ilyaarkov.com, I freely and voluntarily consent to Ilya Arkov (the Controller, contact: hello@ilyaarkov.com) processing my personal data in my interests on the following terms.',
    sections: [
      { title: 'Data covered', text: 'The name and contact details (email address, phone number or messenger username) that I enter in the form. If I complete the optional fields, this consent also covers personal data included in the project link and description. Do not include other people’s data, health information, other special categories of personal data or payment details.' },
      { title: 'Purposes', text: 'To review my request, contact me, discuss the task, prepare a proposal and agree on project terms. This consent does not cover marketing messages or publication of my data.' },
      { title: 'Processing activities', text: 'Collection, recording, organisation, storage, updating, retrieval, use to respond to my request, transmission to deliver a notification to the Controller through Telegram, restriction, deletion and destruction. Processing may be automated or manual. The request and consent record are sent to the Controller in a message through a Telegram bot. This consent does not authorise public disclosure of my data or waive statutory data processing requirements.' },
      { title: 'Duration and withdrawal', text: 'This consent remains valid from submission until the stated purposes have been fulfilled or until I withdraw it, whichever occurs first. I may withdraw consent by emailing hello@ilyaarkov.com and identifying the contact details used in my request. The Controller will stop processing and delete the data within the time limits set by Russian law unless another lawful basis for processing applies.' },
      { title: 'Record of consent', text: 'The checkbox is unchecked by default. Consent requires a separate action; visiting the website or reading the policy does not constitute consent. The fact of consent, text version, form language and server receipt time are recorded with the request to provide evidence of consent.' },
    ],
  },
};
