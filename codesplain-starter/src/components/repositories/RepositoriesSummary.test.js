import { screen, render } from "@testing-library/react";
import { element } from "prop-types";
import RepositoriesSummary from "./RepositoriesSummary";

test('displays primary language of repository', () => {
    const repository = {
        language: 'Python',
        stargazers_count: 5,
        forks: 20,
        open_issues: 3
    }
    render(<RepositoriesSummary repository={repository}/>)

    const language = screen.getByText('Python');

    expect(language).toBeInTheDocument;
})

//looping over every item in the repo object, easier than getting every single element
test('displays informations of repository', () => {
    const repository = {
        language: 'Python',
        stargazers_count: 5,
        forks: 20,
        open_issues: 3
    }
    render(<RepositoriesSummary repository={repository}/>)

    for (let key in repository) {
        const value = repository[key];
        //o regExp deixa mais abragente o que pesquisar
        const element = screen.getByText(new RegExp(value));

        expect(element).toBeInTheDocument()
    }
})