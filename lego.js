'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

var priorityFunc = ['and', 'or', 'filterIn', 'sortBy', 'select', 'limit', 'format'];

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var copyCollection = JSON.parse(JSON.stringify(collection));
    var arg = [].slice.call(arguments);

    arg.splice(0, 1);
    arg.sort(sortPriorityFunc);

    // for (var i = 0; i < arg.length; i++) {
    //    copyCollection = arg[i].func(copyCollection);
    // }
    arg.forEach(function (item) {
        copyCollection = item.func(copyCollection);
    });

    return copyCollection;
    // return collection;
};

function sortPriorityFunc(argA, argB) {

    return priorityFunc.indexOf(argA.name) - priorityFunc.indexOf(argB.name);
}

/**
 * Выбор полей
 * @params {...String}
 * @returns {Object}
 */
exports.select = function () {
    var fields = [].slice.call(arguments);
    var selectedCol = [];

    return {
        name: 'select',
        func: function (collection) {
            // for (var i = 0; i < collection.length; i++) {
            //    selectedCol.push(copyNoteCollection(collection[i], fields));
            // }
            collection.forEach(function (item) {
                selectedCol.push(copyNoteCollection(item, fields));
            }
            );

            return selectedCol;
        }
    };
};

function copyNoteCollection(note, fields) {
    var remarkCol = {};

    for (var key in note) {
        if (fields.indexOf(key) !== -1) {
            remarkCol[key] = note[key];
        }
    }

    return remarkCol;
}

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Object}
 */
exports.filterIn = function (property, values) {
    // console.info(property, values);
    var filteredCol = [];

    return {
        name: 'filterIn',
        func: function (collection) {
            for (var i = 0; i < collection.length; i++) {
                if (collection[i][property] !== undefined &&
                    values.indexOf(collection[i][property]) !== -1) {
                    filteredCol.push(collection[i]);
                }
            }

            return filteredCol;
        }
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Object}
 */
exports.sortBy = function (property, order) {
    // console.info(property, order);

    return {
        name: 'sortBy',
        func: function (collection) {
            collection.sort(function (personaA, personaB) {
                // if (order === 'desc') {

                   // return personaB[property] - personaA[property];
                // }

                return (order === 'asc') ? personaA[property] > personaB[property]
                : personaA[property] < personaB[property];
            });

            return collection;
        }
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Object}
 */
exports.format = function (property, formatter) {
    // console.info(property, formatter);

    return {
        name: 'format',
        func: function (collection) {
            for (var i = 0; i < collection.length; i++) {
                collection[i][property] = formatter(collection[i][property]);
            }

            return collection;
        }
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Object}
 */
exports.limit = function (count) {
    // console.info(count);

    return {
        name: 'limit',
        func: function (collection) {

            return collection.slice(0, count);
        }
    };
};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Object}
     */
    exports.or = function () {
        var resArray;
        var orCollection = [];
        var arg = [].slice.call(arguments);

        return {
            name: 'or',
            func: function (collection) {
                // for (var i = 0; i < arg.length; i++) {
                //    resArray = arg[i].func(collection);
                //    // .filter(function (value) {
                //    //    return resArray.indexOf(value) !== -1;
                //    // });
                //    // if (resArray.length !== 0) {
                //    //    Array.prototype.push.apply(orCollection, resArray);
                //    // }
                //    orCollection = orCollection.concat(resArray);
                // // orCollection = collection.filter(function (element) {
                // //    return arg.some(function (iarg) {
                // //        return iarg(collection).indexOf(element) !== -1;
                // //    });
                // // });
                // }
                resArray = collection.filter(function (elem) {
                    return arg.some(function (item) {
                        return item.func(collection).indexOf(elem) !== -1;
                    });
                });

                orCollection = orCollection.concat(resArray);

                return orCollection.slice();

                // return orCollection;
            }
        };
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Object}
     */
    exports.and = function () {
        var arg = [].slice.call(arguments);

        return {
            name: 'and',
            func: function (collection) {
                var andCollection = collection.slice();
                for (var i = 0; i < arg.length; i++) {
                    andCollection = arg[i].func(andCollection);
                }

                return andCollection;
            }
        };
    };
}
