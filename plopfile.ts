import { NodePlopAPI } from 'plop';

export default function (plop: NodePlopAPI) {
    plop.addPartial('modelName', '{{ pascalCase name }}');
    plop.addPartial('fileName', '{{ kebabCase name }}');
    plop.addPartial('repositoryName', '{{ pascalCase name }}Repository');
    plop.addPartial('repositoryInstanceName', '{{ camelCase name }}Repository');
    plop.addPartial('queryResolverName', '{{ pascalCase name }}QueryResolver');
    plop.addPartial('mutationResolverName', '{{ pascalCase name }}MutationResolver');
    plop.addPartial('serviceName', '{{ pascalCase name }}Service');
    plop.addPartial('serviceInstanceName', '{{ camelCase name }}Service');
    plop.addPartial('dataloaderName', '{{ pascalCase name }}DataLoader');
    plop.addPartial('dataloaderInstanceName', '{{ camelCase name }}DataLoader');
    plop.addPartial('paginationConnectionName', '{{ pascalCase name }}Connection');

    const folderPath = '_codegen';
    const templatePath = 'plop-templates';
    // module generator
    plop.setGenerator('module', {
        description: 'application module logic',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'module name please',
            },
        ],
        actions: (data: any) => {
            return [
                {
                    type: 'add',
                    path: `${folderPath}/{{kebabCase name}}/dataloaders/{{kebabCase name}}.dataloader.ts`,
                    templateFile: `${templatePath}/sample/dataloaders/dataloader.hbs`,
                },
                {
                    type: 'add',
                    path: `${folderPath}/{{kebabCase name}}/dto/{{kebabCase name}}.args.ts`,
                    templateFile: `${templatePath}/sample/dto/args.hbs`,
                },
                {
                    type: 'add',
                    path: `${folderPath}/{{kebabCase name}}/dto/{{kebabCase name}}.input.ts`,
                    templateFile: `${templatePath}/sample/dto/input.hbs`,
                },
                {
                    type: 'add',
                    path: `${folderPath}/{{kebabCase name}}/entities/{{kebabCase name}}.entity.ts`,
                    templateFile: `${templatePath}/sample/entities/entity.hbs`,
                },
                {
                    type: 'add',
                    path: `${folderPath}/{{kebabCase name}}/repositories/{{kebabCase name}}.repository.ts`,
                    templateFile: `${templatePath}/sample/repositories/repository.hbs`,
                },
                {
                    type: 'add',
                    path: `${folderPath}/{{kebabCase name}}/resolvers/{{kebabCase name}}_mutation.resolver.ts`,
                    templateFile: `${templatePath}/sample/resolvers/mutation.resolver.hbs`,
                },
                {
                    type: 'add',
                    path: `${folderPath}/{{kebabCase name}}/resolvers/{{kebabCase name}}_query.resolver.ts`,
                    templateFile: `${templatePath}/sample/resolvers/query.resolver.hbs`,
                },
                {
                    type: 'add',
                    path: `${folderPath}/{{kebabCase name}}/services/{{kebabCase name}}.service.ts`,
                    templateFile: `${templatePath}/sample/services/service.hbs`,
                },
                {
                    type: 'add',
                    path: `${folderPath}/{{kebabCase name}}/{{kebabCase name}}.module.ts`,
                    templateFile: `${templatePath}/sample/module.hbs`,
                },
            ];
        },
    });
}
