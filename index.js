const Resolver = require('metro-resolver');
const path     = require('path');

/**
 * Custom path resolver module
 *
 * @param {Object} context
 * @param {string} moduleName
 * @param {string} platform
 *
 * @return {undefined}
 */
const resolver = function (context, moduleName, platform) {
	const { excludePath, rootPath, projectPath } = this;

	const clearContext = { ...context, resolveRequest: undefined };

	if (
		context.originModulePath.includes(rootPath) &&
		moduleName.startsWith('./') &&
		!moduleName.match(excludePath) &&
		!context.originModulePath.match(excludePath)
	) {
		const originPath     = clearContext
			.originModulePath
			.replace(`/${path.basename(clearContext.originModulePath)}`, '');
		const absoluteModule = path.resolve(originPath, moduleName);
		const projectModule  = absoluteModule.replace(rootPath, projectPath);

		// console.log('\n-------------')
		// console.log(`Origin: ${context.originModulePath}`)
		// console.log(`Module: ${moduleName}`)
		// console.log(`Absolute module: ${absoluteModule}`)
		// console.log(`Project module: ${projectModule}`)
		// console.log('-------------')

		try {
			return Resolver.resolve(clearContext, projectModule, platform);
		} catch (e) {
			//
		}
	}

	return Resolver.resolve(clearContext, moduleName, platform);
};

/**
 * Custom path resolver constructor
 *
 * @param {Object} config
 *
 * @return {resolver}
 * @constructor
 */
const CustomPathResolver = config => resolver.bind({
	projectPath: /(node_modules|projects)/,
	...config,
});

exports.CustomPathResolver = CustomPathResolver;
module.exports             = CustomPathResolver;
