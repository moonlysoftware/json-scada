'use strict'

/*
 * {json:scada} - Copyright (c) 2020-2021 - Ricardo L. Olsen
 * This file is part of the JSON-SCADA distribution (https://github.com/riclolsen/json-scada).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

module.exports = {
NAME: 'MQTT-SPARKPLUG-B',
ENV_PREFIX: 'JS_MQTTSPB_',
AUTOTAG_PREFIX: 'MQTT',
MSG: '{json:scada} - MQTT-Sparkplug-B Client Driver',
VERSION: '0.1.1',
MAX_QUEUEDMETRICS: 10000,
SPARKPLUG_PUBLISH_INTERVAL: 777,
}