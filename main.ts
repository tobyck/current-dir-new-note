import { Plugin, Notice } from "obsidian"

export default class CurrentDirNewNote extends Plugin {
	async onload() {
		this.registerDomEvent(document, "click", async (event: MouseEvent) => {
			try {
				const target = event.target as HTMLElement
				if (!target || !target.classList.contains("cm-underline")) return

				const linkedNoteName = target.innerText;
				const resolvedPath = this.app.metadataCache.getFirstLinkpathDest(linkedNoteName, "")
				if (resolvedPath) return

				const activeFolder = this.app.workspace.getActiveFile()!.path.split("/").slice(0, -1).join("/")
				const newFilePath = `${activeFolder}/${linkedNoteName}.md`

				const newFile = await this.app.vault.create(newFilePath, "")
				await this.app.workspace.getLeaf().openFile(newFile)
			} catch (error) {
				let noticeMessage = "Error in 'Current Directory New Note' plugin"
				if (error?.message) noticeMessage += ": " + error.message
				new Notice(noticeMessage)
			}
		});
	}
}
