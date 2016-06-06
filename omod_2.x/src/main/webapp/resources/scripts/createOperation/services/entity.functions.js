/*
 * The contents of this file are subject to the OpenMRS Public License
 * Version 2.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and
 * limitations under the License.
 *
 * Copyright (C) OpenHMIS.  All Rights Reserved.
 *
 */

(function () {
	'use strict';

	var app = angular.module('app.stockOperationFunctionsFactory', []);
	app.service('CreateOperationFunctions', CreateOperationFunctions);

	CreateOperationFunctions.$inject = ['EntityFunctions', '$filter'];

	function CreateOperationFunctions(EntityFunctions, $filter) {
		var service;

		service = {
			formatDate: formatDate,
			formatTime: formatTime,
			onChangeDatePicker: onChangeDatePicker,
			changeOperationDate: changeOperationDate,
			changeWarningDialog: changeWarningDialog,
			createExpirationDates: createExpirationDates,
			showOperationItemsSection: showOperationItemsSection,
			checkDatePickerExpirationSection: checkDatePickerExpirationSection,
			validateAttributeTypes: validateAttributeTypes,
			validateLineItems: validateLineItems,
			validatePatient: validatePatient,
			validateOperationNumber: validateOperationNumber,
			populateOccurDates: populateOccurDates,
		};

		return service;

		function formatDate(date, includeTime) {
			var format = 'dd-MM-yyyy';
			if (includeTime) {
				format += ' HH:mm';
			}
			return ($filter('date')(new Date(date), format));
		}

		function formatTime(time) {
			var format = 'HH:mm:ss';
			return ($filter('date')(new Date(time), format));
		}

		function onChangeDatePicker(successfulCallback, id) {
			var picker;
			if (id !== undefined) {
				picker = angular.element(document.getElementById(id));
				picker.bind('keyup change select', function () {
					var input = this.value;
					successfulCallback(input);
				});
			} else {
				var elements = angular.element(document.getElementsByTagName("input"));
				for (var i = 0; i < elements.length; i++) {
					var element = elements[i];
					if (element.id.indexOf("display") > -1) {
						picker = angular.element(element);
						picker.bind('keyup change select', function () {
							successfulCallback(this.value);
						});
					}
				}
			}
		}

		function changeOperationDate($scope) {
			var dialog = emr.setupConfirmationDialog({
				selector: '#change-operation-date-dialog',
				actions: {
					confirm: function () {
						var operationDate = angular.element(document.getElementById('operationDateId-field'))[0].value;
						if ($scope.operationOccurDate !== undefined) {
							var time = $scope.operationOccurDate.time;
							operationDate += ', ' + time;
							$scope.operationDate = formatDate(new Date(operationDate), true);
						} else {
							$scope.operationDate = formatDate(new Date(operationDate));
						}
						$scope.$apply();
						dialog.close();
					},
					cancel: function () {
						dialog.close();
					}
				}
			});

			dialog.show();

			EntityFunctions.disableBackground();
		}

		/**
		 * Display a warning dialog box
		 * @param $scope
		 */
		function changeWarningDialog($scope, newVal, oldVal, source) {
			if (source === 'operationType') {
				$scope.operationType = JSON.parse(oldVal);
				$scope.warningTitle = emr.message('openhmis.inventory.operations.confirm.title.operationTypeChange');
				$scope.warningMessage = emr.message('openhmis.inventory.operations.confirm.operationTypeChange');
			} else if (source === 'stockroom') {
				$scope.sourceStockroom = JSON.parse(oldVal);
				$scope.warningTitle = emr.message('openhmis.inventory.operations.confirm.title.sourceStockroomChange');
				$scope.warningMessage = emr.message('openhmis.inventory.operations.confirm.sourceStockroomChange');
			}

			var dialog = emr.setupConfirmationDialog({
				selector: '#warning-dialog',
				actions: {
					confirm: function () {
						if (source === 'operationType') {
							$scope.operationType = newVal;
						} else if (source === 'stockroom') {
							$scope.sourceStockroom = newVal;
						}

						$scope.lineItems = [];
						$scope.addLineItem();

						if (source === 'operationType') {
							$scope.loadOperationTypeAttributes();
						}

						$scope.$apply();

						dialog.close();
					},
					cancel: function () {
						dialog.close();
					}
				}
			});

			dialog.show();

			EntityFunctions.disableBackground();
		}

		/**
		 * Create Item Stock Line Items expiration dates.
		 * @param itemStocks
		 * @returns {Array}
		 */
		function createExpirationDates(itemStocks) {
			var itemStockExpirationDates = [];
			//create expiration date drop-down
			itemStockExpirationDates.push("Auto");
			if (itemStocks !== null && itemStocks.length > 0) {
				var itemStock = itemStocks[0];
				if (itemStock !== null && "details" in itemStock) {
					var nullExpiration = false;
					for (var i = 0; i < itemStock.details.length; i++) {
						var detail = itemStock.details[i];
						var expiration = detail.expiration;
						if (expiration !== null) {
							expiration = expiration.split("T")[0];
						} else {
							nullExpiration = true;
							continue;
						}

						if (itemStockExpirationDates.indexOf(expiration) === -1) {
							itemStockExpirationDates.push(expiration);
						}
					}
					if (nullExpiration) {
						itemStockExpirationDates.push("None");
					}
				}
			}
			return itemStockExpirationDates;
		}

		function showOperationItemsSection($scope) {
			var operationType = $scope.operationType;
			if (operationType === undefined) {
				return false;
			} else if (operationType.hasRecipient && !operationType.hasSource && !operationType.hasDestination) {
				return true;
			} else if (operationType.hasSource && operationType.hasDestination) {
				if ($scope.sourceStockroom.name !== ' - Not Defined - ' && $scope.destinationStockroom.name !== ' - Not Defined - ') {
					return true;
				}
			} else if (operationType.hasSource || operationType.hasDestination) {
				if (operationType.hasSource) {
					if ($scope.sourceStockroom !== undefined && $scope.sourceStockroom.name !== ' - Not Defined - ') {
						return true;
					}
				} else {
					if ((operationType.hasDestination && $scope.destinationStockroom.name !== ' - Not Defined - ')) {
						return true;
					}
				}
			}
			return false;
		}

		function checkDatePickerExpirationSection(lineItem, $scope) {
			if (lineItem !== undefined && lineItem.itemStockHasExpiration) {
				if ($scope.operationType.name === 'Receipt' || $scope.operationType.name === 'Return') {
					lineItem.setExpirationHasDatePicker(true);
				}
			}
		}

		function validateAttributeTypes($scope) {
			// validate attribute types
			var requestAttributeTypes = [];
			if (EntityFunctions.validateAttributeTypes($scope.attributeTypeAttributes, $scope.attributes, requestAttributeTypes)) {
				$scope.entity.attributes = requestAttributeTypes;
				return true;
			}

			$scope.submitted = true;
			return false;
		}

		function validateLineItems($scope) {
			var validatedItems = [];
			if (EntityFunctions.validateLineItems($scope.lineItems, validatedItems)) {
				$scope.entity.items = validatedItems;
				return true;
			}

			$scope.submitted = true;
			return false;
		}

		// validate patient
		function validatePatient($scope) {
			if ($scope.operationType.hasRecipient) {
				if ($scope.selectedPatient !== '') {
					$scope.entity.patient = $scope.selectedPatient.uuid;
					$scope.entity.destination = '';
					$scope.entity.institution = '';
					$scope.entity.department = '';
				} else {
					$scope.submitted = true;
					emr.errorAlert("openhmis.inventory.operations.required.patient");
					return false;
				}
			}
			return true;
		}

		// validate operation number
		function validateOperationNumber($scope) {
			if ($scope.entity.operationNumber === undefined ||
				$scope.entity.operationNumber === '') {
				$scope.submitted = true;
				emr.errorAlert("openhmis.inventory.operations.error.number");
				return false;
			}
			return true;
		}

		function populateOccurDates($scope, operations) {
			$scope.operationOccurs = [];
			if (operations !== null && operations.length > 0) {
				var tempDate;
				for (var i = 0; i < operations.length; i++) {
					var operation = operations[i];
					var operationDate = new Date(operation.operationDate);
					var display = formatTime(new Date(operationDate));

					var operationDate = {};
					operationDate['time'] = display;
					operationDate['name'] =
						emr.message("openhmis.inventory.operations.before") + " "
						+ operation.operationNumber + " (" + display + ")";
					$scope.operationOccurs.push(operationDate);
					tempDate = display;
				}

				if ($scope.operationOccurs.length > 0) {
					var operationDate = {};
					operationDate['time'] = tempDate;
					operationDate['name'] = emr.message("openhmis.inventory.operations.afterLastOperation");
					$scope.operationOccurs.push(operationDate);
				}
			}
		}
	}
})();