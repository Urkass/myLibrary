'use strict';

var data = {
    'students': {
        'name': 'students',
        'data': [{
            'id': 0,
            'name': 'Петр',
            'surname': 'Кузнецов',
            'team-id': 0,
            'tasks-ids': [0]
        }, {
            'id': 1,
            'name': 'Василий',
            'surname': 'Соловьев',
            'team-id': 1,
            'tasks-ids': [1]
        }, {
            'id': 2,
            'name': 'Джон',
            'surname': 'Малкович',
            'team-id': 0,
            'tasks-ids': []
        }]
    },
    'teams': {
        'name': 'teams',
        'data': [{
            'id': 0,
            'name': 'Головастики',
            'students-ids': [0, 2],
            'tasks-ids': []
        }, {
            'id': 1,
            'name': 'Барселона',
            'students-ids': [1],
            'tasks-ids': [2, 3]
        }]
    },
    'tasks': {
        'name': 'tasks',
        'data': [{
            'id': 0,
            'name': 'Упражнение на смекалку',
            'description': 'В качестве дополнительного задания вы можете реализовать добавление студентов в офлайне с последующей синхронизацией. При выполнении обратите внимание на способы определения режима «онлайн/офлайн».',
            'mark': undefined,
            'owner-tableName': 'students',
            'owner-id': 0
        }, {
            'id': 1,
            'name': 'Задание 1',
            'description': 'Приложение позволяет добавлять и редактировать данные студентов ШРИ (ФИО, ссылку на фотографию и краткую информацию). Для работы в офлайне оно использует ServiceWorker, позволяя при этом, как минимум, просматривать данные студентов.',
            'mark': undefined,
            'owner-tableName': 'students',
            'owner-id': 1
        }, {
            'id': 2,
            'name': 'Для дизайнеров',
            'description': 'Однако при реализации были допущены несколько ошибок: — без подключения к серверу приложение не работает;— не всегда обновляется список студентов после добавления нового.',
            'mark': undefined,
            'owner-tableName': 'teams',
            'owner-id': 1
        }, {
            'id': 3,
            'name': 'Легкое задание',
            'description': 'Мы не ограничиваем вас в использовании сторонних инструментов и библиотек, однако при их использовании также ожидаем комментариев, в которых вы расскажете, зачем и почему вы применили то или иное средство.',
            'mark': undefined,
            'owner-tableName': 'teams',
            'owner-id': 1
        }]
    }
};

if (typeof Storage !== "undefined") {
    Object.keys(data).forEach(function (table) {
        saveTable(table);
    });
    
} else {
    alert('LocalStorage не поддерживается Вашим браузером!');
}

function saveTable(table) {
    localStorage.setItem(table.name, JSON.stringify(table));
}

function deleteAllTables() {
    if (confirm("Удаление ВСЕХ таблиц. Вы уверены?")) {
        Object.keys(data).forEach(function (table) {
            console.log(table + ' deleted');
            deleteTable(table);
        });
    }
}
function deleteTable(tableName) {
    localStorage.removeItem(tableName);
}