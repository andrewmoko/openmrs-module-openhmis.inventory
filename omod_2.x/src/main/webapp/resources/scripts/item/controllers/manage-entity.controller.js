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

(function() {
	'use strict';

	var base = angular.module('app.genericManageController');
	base.controller("ManageItemController", ManageItemController);
	ManageItemController.$inject = ['$injector', '$scope', '$filter',
			'EntityRestFactory', 'CssStylesFactory', 'PaginationService',
			'ItemModel', 'CookiesService', 'ItemRestfulService'];

	function ManageItemController($injector, $scope, $filter,
			EntityRestFactory, CssStylesFactory, PaginationService, ItemModel,
			CookiesService, ItemRestfulService) {

		var self = this;

		var module_name = 'inventory';
		var entity_name = emr.message("openhmis.inventory.item.name");
		var rest_entity_name = emr.message("openhmis.inventory.item.rest_name");

		// @Override
		self.getModelAndEntityName = self.getModelAndEntityName
				|| function() {
					self.bindBaseParameters(module_name, rest_entity_name,
							entity_name);
				}

		self.bindExtraVariablesToScope = self.bindExtraVariablesToScope || function() {
				self.loadDepartments();
				$scope.department = $scope.department || {};
				$scope.searchItems = self.searchItems;
			}

		self.loadDepartments = self.loadDepartments || function(){
				ItemRestfulService.loadDepartments(self.onLoadDepartmentsSuccessful);
			}

		self.searchItems = self.searchItems || function(){
				var department_uuid;
				if($scope.department !== null){
					department_uuid = $scope.department.uuid;
				}

				ItemRestfulService.searchItems($scope.searchField, $scope.currentPage, $scope.limit, department_uuid, self.onLoadItemsSuccessful)
			}

		self.onLoadItemsSuccessful = self.onLoadItemsSuccessful || function(data){
				$scope.fetchedEntities = data.results;
				$scope.totalNumOfResults = data.length;
			}

		self.onLoadDepartmentsSuccessful = self.onLoadDepartmentsSuccessful || function(data){
				$scope.departments = data.results;
			}

		/* ENTRY POINT: Instantiate the base controller which loads the page */
		$injector.invoke(base.GenericManageController, self, {
			$scope : $scope,
			$filter : $filter,
			EntityRestFactory : EntityRestFactory,
			PaginationService : PaginationService,
			CssStylesFactory : CssStylesFactory,
			GenericMetadataModel : ItemModel,
			CookiesService : CookiesService
		});
	}
})();
