/*
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.1 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 *
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */
package org.openmrs.module.openhmis.inventory.web;

import org.openmrs.module.openhmis.commons.web.WebConstants;
import org.openmrs.module.openhmis.inventory.api.util.ModuleConstants;

public class ModuleWebConstants extends WebConstants {
	public static final String MODULE_ROOT = WebConstants.MODULE_BASE + ModuleConstants.MODULE_NAME + "/";
	public static final String MODULE_RESOURCE_ROOT = WebConstants.MODULE_RESOURCE_BASE + ModuleConstants.MODULE_NAME + "/";

	public static final String ITEMS_ROOT = MODULE_ROOT + "items";
	public static final String ITEMS_PAGE = ITEMS_ROOT + ".form";

	public static final String DEPARTMENTS_ROOT = MODULE_ROOT + "departments";
	public static final String DEPARTMENTS_PAGE = DEPARTMENTS_ROOT + ".form";

	public static final String CATEGORIES_ROOT = MODULE_ROOT + "categories";
	public static final String CATEGORIES_PAGE = CATEGORIES_ROOT + ".form";

	public static final String STOCK_ROOMS_ROOT = MODULE_ROOT + "stockRooms";
	public static final String STOCK_ROOMS_PAGE = STOCK_ROOMS_ROOT + ".form";

	public static final String MODULE_INIT_JS = MODULE_RESOURCE_ROOT + "js/init.js";

	/**
	 * Returns the full page url for a module page.
	 * @param relativePath The page url, relative to the module web directory.
	 * @return The full page url.
	 */
	public static String getModulePageUrl(String relativePath) {
		return MODULE_ROOT + relativePath;
	}
}
